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
];
