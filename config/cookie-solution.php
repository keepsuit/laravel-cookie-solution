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
    | Color Scheme
    |--------------------------------------------------------------------------
    |
    | Colors of the banner and the policy views: 'light', 'dark' or 'auto'
    | (follows the visitor's system setting). With 'dark' and 'auto' the
    | policy views expect a dark page background.
    |
    */

    'color_scheme' => 'light',

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
