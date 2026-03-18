<?php

use Illuminate\Support\Facades\Route;
use Keepsuit\CookieSolution\Controllers\ScriptController;

Route::get('/cookie-solution/laravel-cookie-solution.js', ScriptController::class);
