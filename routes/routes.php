<?php

use Illuminate\Support\Facades\Route;
use Keepsuit\CookieSolution\Controllers\ApiController;
use Keepsuit\CookieSolution\Controllers\ScriptController;

Route::get('/cookie-solution/laravel-cookie-solution.js', ScriptController::class);

if (is_string($apiRoute = config('cookie-solution.api_route'))) {
    Route::middleware(config('cookie-solution.api_middleware', ['api']))
        ->prefix($apiRoute)
        ->group(function () {
            Route::get('/', [ApiController::class, 'config'])->name('cookie-solution.config');
            Route::get('/policies', [ApiController::class, 'policies'])->name('cookie-solution.policies');
        });
}
