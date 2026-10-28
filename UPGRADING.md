# Upgrading

## From 1.x to 2.0

### Requirements

Laravel 11 is no longer supported: 2.0 requires Laravel 12 or 13.

### Integrations removed

The `integrations` config (`google_tag_manager`, `facebook_pixel`) has been removed: the script no longer calls `gtag` or `fbq`.
Remove the `integrations` key from your published `config/cookie-solution.php`.

- Google Tag Manager: add `@include('cookie-solution::google-consent-mode')` in `<head>` before GTM. It sets the consent-mode default from the stored consent and sends the updates, replacing both the 1.x integration and any custom view that computed the default with `CookieSolution::status()`.
- Facebook Pixel and other services: see [Connecting tracking services](docs/tracking.md).

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

The inline configuration now contains only what every page needs (`enabled`, `locale`, `digest`, `cookie_name`, `cookie_lifetime`, `toggle_*` and `content_url`).
Texts, services and the cookie policy are loaded from `content_url` (`GET /api/cookie-solution/content`) when the banner opens.
If your own JavaScript read `cookies` or `texts` from `window._cookieSolution`, fetch `content_url` instead.
The consent `digest` is unchanged: stored consents remain valid after the upgrade.

### New config keys

The package now registers JSON endpoints under `api/cookie-solution` (the Blade banner loads its content from there, see [Headless frontends](docs/headless.md)).
Add the `api` group (`domain`, `path`, `middleware`) to your published config to change the path or the middleware; the middleware must not require authentication or start a session.
The config comments now follow the Laravel style: republishing the config is the simplest way to get them.
