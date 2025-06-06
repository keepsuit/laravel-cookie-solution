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
];
```

Optionally, you can publish the assets, views and translations using.

```bash
php artisan vendor:publish --tag="cookie-solution-assets"
php artisan vendor:publish --tag="cookie-solution-views"
php artisan vendor:publish --tag="cookie-solution-translations"
```

If you publish the assets, remember to publish new versions when you update the package.
You can automate this using composer `post-update-cmd` script:

```json
{
    "scripts": {
        "post-update-cmd": [
            // ...
            "@php artisan vendor:publish --tag=cookie-solution-assets --force"
        ]
    }
}
```

## Usage

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

Update the config `config/cookie-consent.php` file with your data owner's contact email and name and address.

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

Yon can customize the highlight color of the banner and toggle changing the `highlight_color` config value.

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

## Checking status

You can check the user's consent status from laravel using the `CookieSolution::status()` method,
which returns a `CookieSolutionStatus` object with helpers to check if a purpose has been accepted.

## Testing

```bash
composer test
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
