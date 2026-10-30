<?php

use Illuminate\Support\Facades\Route;
use Keepsuit\CookieSolution\Controllers\ApiController;
use Keepsuit\CookieSolution\Controllers\ScriptController;

Route::get('/cookie-solution/laravel-cookie-solution.js', ScriptController::class);

Route::domain(config('cookie-solution.api.domain'))
    ->middleware(config('cookie-solution.api.middleware', []))
    ->prefix(config('cookie-solution.api.path', 'cookie-solution'))
    ->group(function () {
        Route::get('/', [ApiController::class, 'config'])->name('cookie-solution.config');
        Route::get('/content', [ApiController::class, 'content'])->name('cookie-solution.content');
        Route::get('/policies', [ApiController::class, 'policies'])->name('cookie-solution.policies');
    });
