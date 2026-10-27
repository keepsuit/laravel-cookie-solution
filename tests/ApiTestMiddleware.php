<?php

namespace Keepsuit\CookieSolution\Tests;

use Closure;
use Illuminate\Http\Request;

class ApiTestMiddleware
{
    public function handle(Request $request, Closure $next): mixed
    {
        app()->setLocale('it');

        return $next($request)->header('X-Api-Test', '1');
    }
}
