# Upgrading

## From 1.x to 2.0

### Requirements

2.0 requires Laravel 12 or 13.

### Google Tag Manager and Facebook Pixel

The `integrations` config has been removed and the banner no longer calls `gtag` or `fbq`. Remove the `integrations` key from your published `config/cookie-solution.php`.

- Google Tag Manager: add `@include('cookie-solution::google-consent-mode')` in `<head>` before GTM. It replaces both the 1.x integration and any custom view that computed the consent default with `CookieSolution::status()`.
- Facebook Pixel and other services: see [Connecting tracking services](docs/tracking.md).

### Published files

Publish again (or merge the changes into) anything you published:

- `script.blade.php`: the 1.x copy fails with an undefined `$highlightColor` variable. The new view loads the bundle with `<script defer>`.
- Policy views: new `part` attributes, new default style and translated session durations.
- Translations: new keys `cookie_policy.duration_session` and `privacy_policy.service_privacy_policy`; without them the raw keys are shown.
- Markdown policies (`resources/views/vendor/cookie-solution/policy`): the default texts have been revised (no implicit consent, no "anonymous data" or "no third parties" claims). Your copies keep the old texts: review them.

### Banner

- The banner has a new design and the `banner-root` part is now a native `<dialog>`: check any custom CSS on its parts.
- The banner uses `cookie_name` and `cookie_lifetime` from the config (1.x always used `laravel_cookie_solution` and 365 days). If you changed `cookie_name`, users are asked for consent again once.

### `window._cookieSolution` and `CookieSolution::getConfig()`

Both contain only the boot configuration. Texts and services (`cookies` in 1.x) are loaded from `content_url` when the banner opens; in PHP use `CookieSolution::getContent()`. Stored consents remain valid.

### API routes

The package registers public JSON endpoints under `api/cookie-solution`, used by the Blade banner too (see [Headless frontends](docs/headless.md)). To change the path or the middleware, add the `api` group to your published config; the middleware must not require authentication or start a session.
