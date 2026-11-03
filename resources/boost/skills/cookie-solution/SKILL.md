---
name: cookie-solution
description: Set up the keepsuit cookie banner (keepsuit/laravel-cookie-solution, @keepsuit/cookie-solution). Use when adding the cookie banner or cookie/privacy policy pages, registering cookie services, gating tracking scripts (GTM/GA, Meta Pixel, PostHog, Clarity) on consent, connecting a headless/React frontend to it, or upgrading from 1.x.
---

# Cookie Solution

Laravel is the single source of truth: services, texts, translations and policies are configured in PHP. The frontend only renders the banner and stores the user's choice in a cookie. Docs: `vendor/keepsuit/laravel-cookie-solution/` (`README.md`, `docs/headless.md`, `docs/tracking.md`, `docs/customization.md`), or the same paths on https://github.com/keepsuit/laravel-cookie-solution.

## Steps

1. **Register services** used by the site in a service provider, via `$this->app->afterResolving(CookieSolution::class, fn ($cs) => $cs->register(...))`. Use the factories in `Keepsuit\CookieSolution\ServiceFactories\*` (e.g. `GoogleAnalytics4ServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build()`), or `new Service(...)` for anything missing. Every service that sets cookies must be registered: the list feeds the banner and the cookie policy. `CookieSolution` is scoped (rebuilt per request/job on Octane and queue workers): never register on the instance directly in `boot()`.
2. **Set `data_owner`** in `config/cookie-solution.php`; the privacy policy is incomplete without it.
3. **Mount the banner**, by frontend type:
   - **Blade**: `@include('cookie-solution::script')` in `<head>`; `highlight_color` and `color_scheme` (`light`, `dark`, `auto`) in the config set the banner colors (headless too). Policy pages: `@include('cookie-solution::cookie-policy')` and `@include('cookie-solution::privacy-policy')`, styled via `::part()` (`docs/customization.md`).
   - **Headless** (React, SSR, any SPA): the JSON endpoints are always registered (`api.path`, `api.domain`, `api.middleware`, empty by default: no auth, session or per-IP throttling). Install `@keepsuit/cookie-solution`, fetch `GET /{api.path}?locale={page locale}`, call `mount(config)` in the browser only, and call it again when the locale changes. The banner fetches its texts and services from `config.content_url` when it opens; if the config was fetched server-side from an internal host, pass `mount(config, { load })` instead. Policy pages: fetch `GET /{api.path}/policies?locale={page locale}`, call `defineElements()`, render the HTML (same markup as the Blade views, unstyled) wrapped in `<cookie-solution-policy-formatter>` for default styles, or style its `part` attributes as attribute selectors.
4. **Gate every tracking service** on consent using the recipes in `docs/tracking.md`. The package itself calls no tracker.
5. **Verify**: with no consent cookie, trackers run in denied/memory mode; after "Accept all", `getStatus()` returns `true` for every purpose that has registered services.

## Gotchas

- **Consent mode default first.** `gtag('consent', 'default', ...)` must run before GTM loads. Blade: `@include('cookie-solution::google-consent-mode')` in `<head>` before GTM. Headless: the inline snippet in `docs/tracking.md` in the server-rendered `<head>`; the stored consent is valid only when its `digest` equals the config `digest`, so copy the snippet with that check.
- **Idempotent handlers.** `onStatusChange` fires with the status in effect (only `necessary` without a stored consent) and again on every change, sometimes with the same status twice.
- **Purposes**: `necessary`, `preferences`, `statistics` (analytics: GA, PostHog, Clarity), `marketing` (ads: Pixel, Google Ads).
- **Opening the banner**: `open()` (or `window.CookieSolution.open()` in Blade) or any element with `data-cookie-solution-toggle`. With such a link in the layout, set `toggle_enabled` to `'auto'` (hides the floating toggle while the link is on the page) or `false`; the link must be reachable on every viewport.
- **Policy texts from the app** (CMS, per site/locale): `$cs->resolvePolicyTextUsing(fn (Policy $policy, string $locale) => ...)` in the same `afterResolving` callback as the services; return Markdown, an `Htmlable` (not sanitized), or `null` to fall back to the files (README, "Policy texts").
- **Saved consent in `<head>`**: `window.cookieSolutionSavedStatus?.()` returns the saved consent synchronously (current `digest` only), before the deferred bundle. Blade: defined by `cookie-solution::script`/`google-consent-mode`, or `@include('cookie-solution::status')`. Headless: render `savedStatusScript(config)` in the server-side `<head>`. Never read the cookie by hand.
- **Snippets without a consent API** (pixels, chat widgets, pasted tags): `<script type="text/plain" data-cookie-solution-purposes="statistics marketing">` (or empty with `data-src`) runs once all listed purposes are granted, once per page, in order; revoking needs a reload (`docs/tracking.md`).
- **Blade API**: `window.CookieSolution` exposes `mount`, `open`, `getStatus`, `onStatusChange`, `defineElements`; `cookie-solution-status-default` (once per page) and `cookie-solution-status-change` are dispatched on `document`.
- **Upgrading from 1.x**: follow `UPGRADING.md` on GitHub (integrations removed, new translation keys, revised default policy texts).
