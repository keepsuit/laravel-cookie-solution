<?php

namespace Workbench\App\Http\Middleware;

use Illuminate\Http\Request;

class PreviewMiddleware
{
    public function handle(Request $request, \Closure $next): mixed
    {
        app()->setLocale($request->route('locale'));

        // Preview options from the query string, e.g. /it?layout=floating&toggle_position=left&highlight_color=%233b82f6&color_scheme=dark
        foreach (['layout', 'toggle_position', 'highlight_color', 'color_scheme'] as $key) {
            if ($request->has($key)) {
                config()->set("cookie-solution.{$key}", $request->query($key));
            }
        }

        return $next($request);
    }
}
