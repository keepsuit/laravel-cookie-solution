# Make your site comply with EU cookie law

[![Latest Version on Packagist](https://img.shields.io/packagist/v/keepsuit/laravel-cookie-solution.svg?style=flat-square)](https://packagist.org/packages/keepsuit/laravel-cookie-solution)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/keepsuit/laravel-cookie-solution/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/keepsuit/laravel-cookie-solution/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/keepsuit/laravel-cookie-solution/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/keepsuit/laravel-cookie-solution/actions?query=workflow%3A"Fix+PHP+code+style+issues"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/keepsuit/laravel-cookie-solution.svg?style=flat-square)](https://packagist.org/packages/keepsuit/laravel-cookie-solution)

This package provides a configurable cookie banner for your Laravel application.
It also includes templates for cookie policy and privacy policy pages.

Note that this package is not a legal advice.
You should always consult a lawyer and change texts and policies for your needs.

## Installation

You can install the package via composer:

```bash
composer require keepsuit/laravel-cookie-solution
```

You can publish the config file with:

```bash
php artisan vendor:publish --tag="cookie-solution-config"
```

This is the contents of the published config file:

```php
<?php

return [
    /**
     * Enable or disable the cookie solution.
     */
    'enabled' => env('COOKIE_SOLUTION_ENABLED', true),

    /**
     * Name of the cookie where we store the user's consent.
     */
    'cookie_name' => 'laravel_cookie_solution',

    /**
     * The cookie's lifetime in days.
     */
    'cookie_lifetime' => 365,

    /**
     * Banner highlight color (ex. #3522dd).
     * If null, the default color will be used.
     */
    'highlight_color' => null,

    /**
     * Floating banner toggle
     * if false, the banner toggle will not be displayed.
     * You need to add "data-cookie-solution-toggle" attribute to an element to open the banner.
     */
    'toggle_enabled' => true,

    /**
     * Cookie toggle position (left or right).
     */
    'toggle_position' => 'right',

    /**
     * The entity responsible for the processing of the data.
     */
    'data_owner' => [
        /**
         * Email address of the data owner.
         */
        'contact_email' => null,

        /**
         * Name/Company name and address of the data owner.
         * This is parsed as Markdown (you can use __text__ for bold and _text_ for italic).
         */
        'name_and_address' => null,
    ],

    /**
     * Path prefix of the JSON endpoints used by headless frontends (ex. cookie-solution).
     * If null, the endpoints are disabled.
     */
    'api_route' => null,

    /**
     * Middleware applied to the JSON endpoints.
     */
    'api_middleware' => ['api'],
];
```

Optionally, you can publish the views and translations using:

```bash
php artisan vendor:publish --tag="cookie-solution-views"
php artisan vendor:publish --tag="cookie-solution-translations"
```

## Usage

The package can be used in two ways:

- **Blade**: the banner script and its configuration are included in your layout (see below).
- **Headless** (React, Vue, any SPA/SSR frontend): Laravel exposes the configuration as JSON and the frontend mounts the banner with the [`@keepsuit/cookie-solution`](#headless-frontends) npm package.

In both cases services, texts, translations and policies are configured in Laravel.

Include the cookie solution script in your layout (it's recommended to include it in the `<head>` tag):

```blade
@include('cookie-solution::script')
```

Register used services in your 'AppServiceProvider' (You can register your own services with `Service` class):

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Keepsuit\CookieSolution\CookieSolution;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleTagManagerServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Meta\FacebookPixelServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Meta\MetaDataProcessingLocation;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->app->afterResolving(CookieSolution::class, function (CookieSolution $cookieSolution) {
            $cookieSolution->register(GoogleAnalytics4ServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
                ->register(GoogleTagManagerServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
                ->register(FacebookPixelServiceFactory::new()->location(MetaDataProcessingLocation::IRELAND)->build());
        });
    }
}
```

Update the config `config/cookie-solution.php` file with your data owner's contact email and name and address.

```php
return [
    // ...
    /**
     * The entity responsible for the processing of the data.
     */
    'data_owner' => [
        /**
         * Email address of the data owner.
         */
        'contact_email' => 'your_email@example.com',

        /**
         * Name/Company name and address of the data owner.
         * This is parsed as Markdown (you can use __text__ for bold and _text_ for italic).
         */
        'name_and_address' => <<<MARKDOWN
            __Your Company Name__
            Your Street 1
            City, Country
            MARKDOWN,
    ],
];
```

Create a route for the cookie policy page and include the cookie policy partial:

```blade
<body>
    @include('cookie-solution::cookie-policy')
</body>
```

Create a route for the privacy policy page and include the privacy policy partial:

```blade
<body>
    @include('cookie-solution::privacy-policy')
</body>
```

See [views customization](#views) section for more information about the partials and how to customize them.

## Customization

#### Highlight color

You can customize the highlight color of the banner and toggle changing the `highlight_color` config value.

#### Toggle position

You can change the toggle position to `left` or `right` by changing the `toggle_position` config value (default to `right`).
If you need a more advanced customization, you can edit the toggle position with some CSS:

```css
:root {
    --cs--toggle-position-bottom: 4rem; /* position from the bottom */
    --cs--toggle-position-x: 2rem; /* position from the left or right (depending on `toggle_position` value) */
}

/* change the position for desktop */
@media (min-width: 1024px) {
    :root {
        --cs--toggle-position-bottom: 2rem;
        --cs--toggle-position-x: 1rem;
    }
}
```

#### Toggle z-index

You can change the toggle z-index by changing the `--cs--toggle-z-index` CSS variable. The default value is `9999`.

#### Disabling toggle

Sometimes you may want to disable the default floating toggle and use your own toggle button.
You can do this by setting the `toggle_enabled` config value to `false`.
Then you need to add the `data-cookie-solution-toggle` attribute to an element in your layout, like this:

```html
<button data-cookie-solution-toggle>
    Toggle Cookie Banner
</button>
```

#### Views

If you want to customize the views, you can publish them with `php artisan vendor:publish --tag="cookie-solution-views"` and style them however you like.
The `<cookie-solution-policy-formatter/>` custom component is used to apply the default styles, you can safely remove it to customize the views.

## Headless frontends

Enable the JSON endpoints by setting `api_route` (and optionally `api_middleware`) in `config/cookie-solution.php`:

```php
'api_route' => 'api/cookie-solution',
'api_middleware' => ['api'],
```

| Endpoint | Response |
|---|---|
| `GET /{api_route}` | banner configuration (`CookieSolutionConfig`) |
| `GET /{api_route}/policies` | `{ "cookie_policy": "<html>", "privacy_policy": "<html>" }` |

Texts and policies use the current application locale, so set it with your own middleware (for example from the `Accept-Language` header).
The response is the same for every user: you can cache it per locale.

Install the frontend package:

```bash
npm install @keepsuit/cookie-solution
```

The package has no side effects on import, so it can be imported during SSR. Call its functions only in the browser:

```ts
import { mount, onStatusChange, getStatus, defineElements } from '@keepsuit/cookie-solution';
import type { CookieSolutionConfig, CookieSolutionStatus } from '@keepsuit/cookie-solution';

const config: CookieSolutionConfig = await fetch('/api/cookie-solution').then((r) => r.json());

// Creates the banner (or updates it, e.g. after a locale change).
mount(config);

// Current consent, or undefined if the user has not chosen yet.
getStatus();

// Called immediately with the current consent (if any) and on every change.
// It can be called more than once with the same status: keep handlers idempotent.
const unsubscribe = onStatusChange((status) => {
    console.log(status.purposes); // { necessary, preferences, statistics, marketing }
});
```

The policies HTML uses the package custom elements: call `defineElements()` before rendering it.

Example with React:

```tsx
import { useEffect, useState } from 'react';
import type { CookieSolutionStatus } from '@keepsuit/cookie-solution';

export function useCookieConsent(): CookieSolutionStatus | undefined {
    const [status, setStatus] = useState<CookieSolutionStatus>();

    useEffect(() => {
        let unsubscribe = () => {};
        import('@keepsuit/cookie-solution').then(({ onStatusChange }) => {
            unsubscribe = onStatusChange(setStatus);
        });
        return () => unsubscribe();
    }, []);

    return status;
}
```

In Blade pages the same functions are available on `window.CookieSolution`, and every change dispatches a `cookie-solution-status-change` event on `document` (with the status in `event.detail`).

## Connecting tracking services

The banner only stores the user's choice: each tracking service must be configured to wait for consent.
The status has one boolean for each purpose: `necessary`, `preferences`, `statistics`, `marketing`.

#### Google Tag Manager / Google Analytics (consent mode)

Consent mode requires a default state **before** the GTM/gtag script is loaded.
Add this script in `<head>`, after `@include('cookie-solution::script')` and before GTM.
It restores the stored consent only if it was given for the current configuration (same `digest`): when you change the services, the banner asks again and Google must not keep the old consent.

```html
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }

    function cookieSolutionConsent(purposes) {
        const state = (granted) => (granted ? 'granted' : 'denied');
        return {
            analytics_storage: state(purposes.statistics),
            ad_storage: state(purposes.marketing),
            ad_user_data: state(purposes.marketing),
            ad_personalization: state(purposes.marketing),
            personalization_storage: state(purposes.preferences),
            functionality_storage: 'granted',
            security_storage: 'granted',
        };
    }

    (function () {
        const config = window._cookieSolution;
        let purposes = {};
        try {
            const value = document.cookie
                .split('; ')
                .find((cookie) => cookie.startsWith(config.cookie_name + '='));
            const status = value && JSON.parse(decodeURIComponent(value.split('=')[1]));
            if (status && status.digest === config.digest) {
                purposes = status.purposes;
            }
        } catch (e) {}
        gtag('consent', 'default', { ...cookieSolutionConsent(purposes), wait_for_update: 500 });
    })();

    document.addEventListener('cookie-solution-status-change', function (event) {
        gtag('consent', 'update', cookieSolutionConsent(event.detail.purposes));
        // Optional: use it as a GTM trigger for other tags.
        dataLayer.push({ event: 'cookie-solution-status-change', status: event.detail.purposes });
    });
</script>
```

In a headless frontend render the same script in the server-side `<head>`, replacing `window._cookieSolution` with `{ cookie_name, digest }` taken from the config endpoint, and update the consent with `onStatusChange` instead of the DOM event.

#### Facebook Pixel

Revoke consent before `fbq('init', ...)`, then follow the user's choice:

```js
fbq('consent', 'revoke');
fbq('init', 'YOUR_PIXEL_ID');

onStatusChange((status) => fbq('consent', status.purposes.marketing ? 'grant' : 'revoke'));
```

#### PostHog

Start without persistent storage and enable it after consent:

```js
posthog.init('YOUR_TOKEN', { persistence: 'memory' });

onStatusChange((status) => {
    posthog.set_config({ persistence: status.purposes.statistics ? 'localStorage+cookie' : 'memory' });
});
```

#### Microsoft Clarity

```js
import Clarity from '@microsoft/clarity';

Clarity.init('YOUR_PROJECT_ID');
Clarity.consent(false);

onStatusChange((status) => Clarity.consent(status.purposes.statistics));
```

In Blade pages use `window.CookieSolution.onStatusChange` (after the banner script has loaded) or listen to the `cookie-solution-status-change` event.

## Checking status

You can check the user's consent status from laravel using the `CookieSolution::status()` method,
which returns a `CookieSolutionStatus` object with helpers to check if a purpose has been accepted.

## Upgrading

See [UPGRADING](UPGRADING.md).

## AI agents

The package ships an agent skill (`cookie-solution`) with setup instructions for Blade and headless frontends.

- Laravel projects with [Laravel Boost](https://laravel.com/docs/boost): it is installed by `php artisan boost:install`.
- Any other project: `npx skills add keepsuit/laravel-cookie-solution`.

## Testing

```bash
composer test
pnpm test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Fabio Capucci](https://github.com/keepsuit)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
