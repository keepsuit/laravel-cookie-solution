# Headless frontends

The Blade integration doesn't need the API: the configuration is rendered in the page and the policies are Blade views.
For other frontends, enable the JSON endpoints in `config/cookie-solution.php` (or with `COOKIE_SOLUTION_API_ENABLED=true`):

```php
'api' => [
    'enabled' => env('COOKIE_SOLUTION_API_ENABLED', false),
    'domain' => env('COOKIE_SOLUTION_API_DOMAIN'),
    'path' => env('COOKIE_SOLUTION_API_PATH', 'api/cookie-solution'),
    'middleware' => ['api'],
],
```

| Endpoint | Response |
|---|---|
| `GET /{path}` | banner configuration (`CookieSolutionConfig`) |
| `GET /{path}/policies` | `{ "cookie_policy": "<html>", "privacy_policy": "<html>" }` |

Texts and policies use the current application locale, so set it with your own middleware (for example from the `Accept-Language` header).
The response is the same for every user: you can cache it per locale (remember `Vary: Accept-Language` if the locale comes from that header).

Install the frontend package:

```bash
npm install @keepsuit/cookie-solution
```

The package has no side effects on import, so it can be imported during SSR. Call its functions only in the browser:

```ts
import { mount, open, onStatusChange, getStatus, defineElements } from '@keepsuit/cookie-solution';
import type { CookieSolutionConfig, CookieSolutionStatus } from '@keepsuit/cookie-solution';

const config: CookieSolutionConfig = await fetch('/api/cookie-solution').then((r) => r.json());

// Creates the banner (or updates it, e.g. after a locale change). Does nothing when `config.enabled` is false.
mount(config);

// Opens the banner, e.g. from a "Cookie settings" link.
open();

// Current consent, or undefined before mount() or if the user has not chosen yet.
getStatus();

// Called immediately with the current consent (if any) and on every change.
// It can be called more than once with the same status: keep handlers idempotent.
const unsubscribe = onStatusChange((status) => {
    console.log(status.purposes); // { necessary, preferences, statistics, marketing }
});
```

Elements with the `data-cookie-solution-toggle` attribute open the banner too.

The policies HTML has no styles. Render it as it is with your own styles, or wrap it in `<cookie-solution-policy-formatter>` for the default ones (see [policy views](customization.md#policy-views) for the available parts).
It uses the package custom elements: call `defineElements()` before rendering it.

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

In Blade pages the same functions are available on `window.CookieSolution`, and every change dispatches a `cookie-solution-status-change` event on `document` (with the status in `event.detail`).
