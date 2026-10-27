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
