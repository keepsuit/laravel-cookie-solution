<?php

namespace Workbench\App\Http\Middleware;

use Illuminate\Http\Request;

class LocaleMiddleware
{
    public function handle(Request $request, \Closure $next): mixed
    {
        app()->setLocale($request->route('locale'));

        return $next($request);
    }
}
