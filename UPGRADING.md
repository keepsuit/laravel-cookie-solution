# Upgrading

## From 1.x to 2.0

### Integrations removed

The `integrations` config (`google_tag_manager`, `facebook_pixel`) has been removed: the script no longer calls `gtag` or `fbq`.
Remove the `integrations` key from your published `config/cookie-solution.php` and configure the services as described in [Connecting tracking services](README.md#connecting-tracking-services).

If you relied on the Google Tag Manager integration, add the consent mode script from the README: it also sets the default consent before GTM loads, which the 1.x integration did not do.
The `cookie-solution-status-change` event is no longer pushed to `dataLayer` automatically (the README script does it).

### Published assets removed

The script is always served by the package route (`/cookie-solution/laravel-cookie-solution.js`).

- Remove `@php artisan vendor:publish --tag=cookie-solution-assets --force` from your `composer.json` scripts.
- Delete the `public/vendor/cookie-solution` directory.

### Highlight color

`highlight_color` is now part of the script configuration and applied by the script (it was a `<style>` tag rendered by the Blade view).
If you overrode `--cs--color-highlight` in your CSS, it still takes precedence only when `highlight_color` is `null`.

### JavaScript

- The Blade bundle exposes its API on `window.CookieSolution` (`mount`, `getStatus`, `onStatusChange`, `defineElements`).
- The banner uses `cookie_lifetime` from the config (1.x always used 365 days).
- The banner uses `cookie_name` from the config (1.x always used `laravel_cookie_solution`). If you changed `cookie_name`, users will be asked for consent again once.

### New config keys

Add `api_route` and `api_middleware` to your published config if you want to use the JSON endpoints for headless frontends (see [Headless frontends](README.md#headless-frontends)).
