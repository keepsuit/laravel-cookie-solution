# Headless frontends

Laravel exposes the banner as JSON endpoints, always registered (the Blade banner uses the content endpoint too).
Configure them in `config/cookie-solution.php`:

```php
'api' => [
    'domain' => env('COOKIE_SOLUTION_API_DOMAIN'),
    'path' => env('COOKIE_SOLUTION_API_PATH', 'cookie-solution'),
    'middleware' => [],
],
```

| Endpoint | Response |
|---|---|
| `GET /{path}?locale=it` | banner configuration (`CookieSolutionConfig`), needed on every page |
| `GET /{path}/content?locale=it&v=…` | banner content (`CookieSolutionContent`): texts, services and cookie policy, loaded from `config.content_url` when the banner opens |
| `GET /{path}/policies?locale=it` | `{ "cookie_policy": "<html>", "privacy_policy": "<html>" }` |

Every endpoint reads the locale from the `locale` query parameter (the app locale when missing; an invalid value returns 422).
The responses are the same for every visitor, so the URL is enough as a cache key.
The content is cached as immutable (`v` is a hash of the content).

The endpoints need no middleware. If you add some, they must not require authentication, start a session (`web`, or `api` with `statefulApi()`) or rate limit by IP (`api` with `throttleApi()`: a server-side rendered frontend fetches the config for every visitor from the same IP).

### CORS

Every endpoint responds with `Access-Control-Allow-Origin: *`, so a frontend on another origin (or `COOKIE_SOLUTION_API_DOMAIN`) can read it without any change to your app.
The requests are plain `GET`s without credentials, so there is no preflight.

Laravel's `HandleCors` middleware applies `config/cors.php` to the routes matching its `paths` (`api/*` by default) and overrides the header set by the package.
If the path falls under `cors.paths` (e.g. `COOKIE_SOLUTION_API_PATH=api/cookie-solution`), `allowed_origins` must allow every origin that loads the banner: with a single origin listed, any other origin is blocked.

Install the frontend package:

```bash
npm install @keepsuit/cookie-solution
```

The package has no side effects on import, so it can be imported during SSR. Call its functions only in the browser:

```ts
import { mount, open, onStatusChange, getStatus, defineElements } from '@keepsuit/cookie-solution';
import type { CookieSolutionConfig, CookieSolutionStatus } from '@keepsuit/cookie-solution';

const config: CookieSolutionConfig = await fetch(`/cookie-solution?locale=${locale}`).then((r) => r.json());

// Creates the banner (or updates it, e.g. after a locale change). With `config.enabled` false it removes the banner.
// The banner content is fetched from `config.content_url` when the banner first opens.
mount(config);

// Opens the banner, e.g. from a "Cookie settings" link.
open();

// Current consent, or undefined before mount() or if the user has not chosen yet.
getStatus();

// Called with the status in effect (the stored consent, or only `necessary` without one) and on every change.
// When the services change, the stored consent is dropped and it is called with only `necessary` granted.
// It can be called more than once with the same status: keep handlers idempotent.
const unsubscribe = onStatusChange((status) => {
    console.log(status.purposes); // { necessary, preferences, statistics, marketing }
});
```

Elements with the `data-cookie-solution-toggle` attribute open the banner too.

The config comes from Laravel, but the frontend can override banner options before mounting, for example to hide the floating toggle when the layout has its own link:

```ts
mount({ ...config, toggle_enabled: 'auto' });
```

`content_url` is built from the host of the request that returned the config.
If the frontend server fetches the config from an internal address the browser can't reach, replace the URL or load the content yourself:

```ts
mount(config, {
    load: (config) => fetch(`/cookie-solution-proxy/${config.locale}`).then((r) => r.json()),
});
```

With SSR you can also pass the content inline (`mount({ ...config, content })`): no request is made, but the content is sent with every page.

The policies HTML is the markup of the Blade policy views, without styles.
Wrap it in `<cookie-solution-policy-formatter>` for the default ones, or style it yourself through the `part` attributes as attribute selectors (`[part~='service']`; see [policy views](customization.md#policy-views) for the available parts).
It uses the package custom elements: call `defineElements()` before rendering it.

The formatter reads its content once, when it is first rendered: remount it when the HTML changes (e.g. with a React `key`). It doesn't read `highlight_color`: set `--cs--color-highlight` on it yourself.

```tsx
<cookie-solution-policy-formatter
    key={locale}
    style={{ '--cs--color-highlight': config.highlight_color }}
    dangerouslySetInnerHTML={{ __html: policies.cookie_policy }}
/>
```

Example with React:

```tsx
import { useEffect, useState } from 'react';
import { onStatusChange, type CookieSolutionStatus } from '@keepsuit/cookie-solution';

export function useCookieConsent(): CookieSolutionStatus | undefined {
    const [status, setStatus] = useState<CookieSolutionStatus>();

    useEffect(() => onStatusChange(setStatus), []);

    return status;
}
```

In Blade pages the same functions are available on `window.CookieSolution`.

The banner also dispatches two events on `document`, with the status in `event.detail`:

- `cookie-solution-status-default`: once per page, before any change, with the stored consent or only `necessary` granted.
- `cookie-solution-status-change`: when the user chooses, or when a new `mount()` changes the status in effect (e.g. new services drop the stored consent).
