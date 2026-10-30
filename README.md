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

    /*
    |--------------------------------------------------------------------------
    | Enabled
    |--------------------------------------------------------------------------
    |
    | Enable or disable the cookie solution (banner, script and API).
    |
    */

    'enabled' => env('COOKIE_SOLUTION_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Consent Cookie
    |--------------------------------------------------------------------------
    |
    | Name of the cookie where the user's consent is stored and its lifetime
    | in days. Changing the name asks every user for consent again.
    |
    */

    'cookie_name' => 'laravel_cookie_solution',

    'cookie_lifetime' => 365,

    /*
    |--------------------------------------------------------------------------
    | Highlight Color
    |--------------------------------------------------------------------------
    |
    | Banner highlight color (ex. #3522dd), any CSS color format. If null,
    | the default color is used, or the `--cs--color-highlight` CSS
    | variable when the page sets it.
    |
    | Colors that keep white button text and are used unchanged (at least
    | 4.5:1 on white): #c2410c (orange, the default), #dc2626 (red),
    | #db2777 (pink), #7c3aed (violet), #4f46e5 (indigo), #2563eb (blue),
    | #0e7490 (cyan), #0f766e (teal), #15803d (green), #334155 (slate).
    | Lighter colors get black button text and are darkened where used as
    | text, focus ring or icon.
    |
    */

    'highlight_color' => null,

    /*
    |--------------------------------------------------------------------------
    | Layout
    |--------------------------------------------------------------------------
    |
    | Banner layout: 'modal' (a dialog centered on the page, which blocks
    | the page until the user chooses) or 'floating' (a compact card in the
    | bottom corner on the toggle_position side, a bottom sheet on mobile,
    | which leaves the page usable).
    |
    */

    'layout' => 'modal',

    /*
    |--------------------------------------------------------------------------
    | Floating Toggle
    |--------------------------------------------------------------------------
    |
    | Show the floating button that reopens the banner (true, false or
    | 'auto'), and its position (left or right). Elements with the
    | "data-cookie-solution-toggle" attribute open the banner too: with
    | 'auto' the floating button is hidden while the page contains one.
    |
    */

    'toggle_enabled' => true,

    'toggle_position' => 'right',

    /*
    |--------------------------------------------------------------------------
    | Data Owner
    |--------------------------------------------------------------------------
    |
    | The entity responsible for the processing of the data, shown in the
    | privacy policy. The name and address are parsed as Markdown (you can
    | use __text__ for bold and _text_ for italic).
    |
    */

    'data_owner' => [
        'contact_email' => null,

        'name_and_address' => null,
    ],

    /*
    |--------------------------------------------------------------------------
    | API
    |--------------------------------------------------------------------------
    |
    | JSON endpoints: banner configuration (GET {path}), banner content
    | (GET {path}/content, loaded by every banner when it opens, Blade
    | included) and policies (GET {path}/policies). The locale is read from
    | the `locale` query parameter. Added middleware must not require
    | authentication, start a session or rate limit by IP (server-side
    | rendering sends every visitor from one IP).
    |
    */

    'api' => [
        'domain' => env('COOKIE_SOLUTION_API_DOMAIN'),

        'path' => env('COOKIE_SOLUTION_API_PATH', 'cookie-solution'),

        'middleware' => [],
    ],

];
```

Optionally, you can publish the views and translations using:

```bash
php artisan vendor:publish --tag="cookie-solution-views"
php artisan vendor:publish --tag="cookie-solution-translations"
```

By default the banner script is served by a package route (`/cookie-solution/laravel-cookie-solution.js`).
If you publish the assets, the script is served from `public/vendor/cookie-solution` through `asset()`, so it uses your `ASSET_URL` (e.g. a CDN):

```bash
php artisan vendor:publish --tag="cookie-solution-assets"
```

The package detects the published assets automatically. Remember to publish them again on every update, for example with a composer `post-update-cmd` script:

```json
{
    "scripts": {
        "post-update-cmd": [
            "@php artisan vendor:publish --tag=cookie-solution-assets --force"
        ]
    }
}
```

## Usage

The package can be used in two ways:

- **Blade**: the banner script and its configuration are included in your layout (see below).
- **Headless** (React, Vue, any SPA/SSR frontend): Laravel exposes the configuration as JSON and the frontend mounts the banner with the [`@keepsuit/cookie-solution`](docs/headless.md) npm package.

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

See [customization](docs/customization.md#policy-views) for the available parts and how to customize the views.

## Documentation

- [Customization](docs/customization.md): highlight color, layout, floating toggle, policy views and `::part()` styling.
- [Headless frontends](docs/headless.md): JSON API and the `@keepsuit/cookie-solution` npm package (React, SSR, SPA).
- [Connecting tracking services](docs/tracking.md): Google Tag Manager consent mode, Facebook Pixel, PostHog, Microsoft Clarity.

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
