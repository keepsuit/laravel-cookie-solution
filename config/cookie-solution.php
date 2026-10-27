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
    | Banner highlight color (ex. #3522dd) written by the Blade script view.
    | If null, the default color is used. Headless frontends set the
    | `--cs--color-highlight` CSS variable themselves.
    |
    */

    'highlight_color' => null,

    /*
    |--------------------------------------------------------------------------
    | Floating Toggle
    |--------------------------------------------------------------------------
    |
    | Show the floating button that reopens the banner, and its position
    | (left or right). When disabled, add the "data-cookie-solution-toggle"
    | attribute to an element of your layout to open the banner.
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
    | Headless API
    |--------------------------------------------------------------------------
    |
    | JSON endpoints for frontends that don't use the Blade views: banner
    | configuration (GET {path}) and policies (GET {path}/policies).
    | Not needed with Blade. Responses use the current app locale, so set
    | it in one of the middleware.
    |
    */

    'api' => [
        'enabled' => env('COOKIE_SOLUTION_API_ENABLED', false),

        'domain' => env('COOKIE_SOLUTION_API_DOMAIN'),

        'path' => env('COOKIE_SOLUTION_API_PATH', 'api/cookie-solution'),

        'middleware' => ['api'],
    ],

];
