---
name: cookie-solution
description: Set up the keepsuit cookie banner (keepsuit/laravel-cookie-solution, @keepsuit/cookie-solution). Use when adding the cookie banner or cookie/privacy policy pages, registering cookie services, gating tracking scripts (GTM/GA, Facebook Pixel, PostHog, Clarity) on consent, connecting a headless/React frontend to it, or upgrading from 1.x.
---

# Cookie Solution

Laravel is the single source of truth: services, texts, translations and policies are configured in PHP. The frontend only renders the banner and stores the user's choice in a cookie. Full docs: `vendor/keepsuit/laravel-cookie-solution/README.md` or https://github.com/keepsuit/laravel-cookie-solution.

## Steps

1. **Register services** used by the site in a service provider, via `$this->app->afterResolving(CookieSolution::class, fn ($cs) => $cs->register(...))`. Use the factories in `Keepsuit\CookieSolution\ServiceFactories\*` (e.g. `GoogleAnalytics4ServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build()`), or `new Service(...)` for anything missing. Every service that sets cookies must be registered: the list feeds the banner and the cookie policy.
2. **Set `data_owner`** in `config/cookie-solution.php`; the privacy policy is incomplete without it.
3. **Mount the banner**, by frontend type:
   - **Blade**: `@include('cookie-solution::script')` in `<head>`. Policy pages: `@include('cookie-solution::cookie-policy')` and `@include('cookie-solution::privacy-policy')`.
   - **Headless** (React, SSR, any SPA): set `api_route` (and `api_middleware`, which must set the app locale) in the config. Install `@keepsuit/cookie-solution`, fetch `GET /{api_route}`, call `mount(config)` in the browser only, and call it again when the locale changes. Policy pages: fetch `GET /{api_route}/policies`, call `defineElements()`, render the HTML.
4. **Gate every tracking service** on consent using the README recipes ("Connecting tracking services"). The package itself calls no tracker.
5. **Verify**: with no consent cookie, trackers run in denied/memory mode; after "Accept all", `getStatus()` returns all purposes `true`.

## Gotchas

- **Consent mode default first.** `gtag('consent', 'default', ...)` must run before GTM loads, from a classic inline `<script>` in `<head>` (in Blade, after the cookie solution include). The stored consent is valid only when its `digest` equals the config `digest`; the README snippet checks it. Copy the snippet with that check.
- **Idempotent handlers.** `onStatusChange` fires immediately with the current status and again on every change, sometimes with the same status twice.
- **Purposes**: `necessary`, `preferences`, `statistics` (analytics: GA, PostHog, Clarity), `marketing` (ads: Pixel, Google Ads).
- **Blade API**: `window.CookieSolution` exposes `mount`, `getStatus`, `onStatusChange`, `defineElements`; changes also dispatch `cookie-solution-status-change` on `document`.
- **Upgrading from 1.x**: follow `UPGRADING.md` on GitHub (integrations and published assets removed).
