<?php

use Illuminate\Support\Facades\Route;
use Keepsuit\CookieSolution\Controllers\ApiController;
use Keepsuit\CookieSolution\Controllers\ContentController;
use Keepsuit\CookieSolution\Controllers\ScriptController;

Route::get('/cookie-solution/laravel-cookie-solution.js', ScriptController::class);
Route::get('/cookie-solution/content/{locale}', ContentController::class)
    ->where('locale', '[A-Za-z]{2,3}([_-][A-Za-z0-9]{2,8})*')
    ->name('cookie-solution.content');

if (config('cookie-solution.api.enabled', false)) {
    Route::domain(config('cookie-solution.api.domain'))
        ->middleware(config('cookie-solution.api.middleware', ['api']))
        ->prefix(config('cookie-solution.api.path', 'api/cookie-solution'))
        ->group(function () {
            Route::get('/', [ApiController::class, 'config'])->name('cookie-solution.config');
            Route::get('/policies', [ApiController::class, 'policies'])->name('cookie-solution.policies');
        });
}
