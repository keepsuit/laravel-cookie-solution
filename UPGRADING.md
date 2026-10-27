# Upgrading

## From 1.x to 2.0

### Requirements

Laravel 11 is no longer supported: 2.0 requires Laravel 12 or 13.

### Integrations removed

The `integrations` config (`google_tag_manager`, `facebook_pixel`) has been removed: the script no longer calls `gtag` or `fbq`.
Remove the `integrations` key from your published `config/cookie-solution.php`.

- Google Tag Manager: add `@include('cookie-solution::google-consent-mode')` in `<head>` before GTM. It sets the consent-mode default from the stored consent and sends the updates, replacing both the 1.x integration and any custom view that computed the default with `CookieSolution::status()`.
- Facebook Pixel and other services: see [Connecting tracking services](README.md#connecting-tracking-services).

### Published views and translations

If you published the views or the translations, publish them again (or merge the changes):

- New translation keys: `banner.button_close`, `cookie_policy.duration_session`, `privacy_policy.service_privacy_policy`. Without them the close button and session cookies show the raw key.
- The policy views have new `part` attributes and render session durations with a translated label.

### Default policy texts

The default cookie policy, privacy policy and service descriptions have been revised (no implicit consent, no "anonymous data" or "no third parties" claims).
If you published the markdown policies in `resources/views/vendor/cookie-solution/policy`, review them: your copies keep the old texts.

### Banner

- The banner is a native `<dialog>`: the `banner-root` part is now the `<dialog>` element.
- A close button (and the Esc key) refuses non-necessary cookies and saves the choice.
- The banner uses `cookie_name` and `cookie_lifetime` from the config (1.x always used `laravel_cookie_solution` and 365 days). If you changed `cookie_name`, users will be asked for consent again once.
- The Blade bundle exposes its API on `window.CookieSolution` (`mount`, `open`, `getStatus`, `onStatusChange`, `defineElements`).

### `window._cookieSolution`

Only relevant if your own JavaScript reads it: `cookies` has been renamed to `services`, `integrations` has been removed, `enabled` and `locale` have been added.

### New config keys

Add `api_route` and `api_middleware` to your published config if you want to use the JSON endpoints for headless frontends (see [Headless frontends](README.md#headless-frontends)).
