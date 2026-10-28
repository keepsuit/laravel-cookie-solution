<?php

namespace Workbench\App\Http\Middleware;

use Illuminate\Http\Request;

class LocaleMiddleware
{
    public function handle(Request $request, \Closure $next): mixed
    {
        app()->setLocale($request->route('locale'));

        // Preview options from the query string, e.g. /it?layout=card&toggle_position=left&highlight_color=%233b82f6
        foreach (['layout', 'toggle_position', 'highlight_color'] as $key) {
            if ($request->has($key)) {
                config()->set("cookie-solution.{$key}", $request->query($key));
            }
        }

        return $next($request);
    }
}
