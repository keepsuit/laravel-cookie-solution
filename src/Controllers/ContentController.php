<?php

namespace Keepsuit\CookieSolution\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Keepsuit\CookieSolution\CookieSolution;

class ContentController
{
    public function __invoke(Request $request, CookieSolution $cookieSolution, string $locale): JsonResponse
    {
        // The route has no middleware: the locale comes from the URL only, so the response is the same for every visitor.
        app()->setLocale($locale);

        $immutable = $request->query('v') === $cookieSolution->contentVersion();

        return response()
            ->json($cookieSolution->getContent())
            ->header('Cache-Control', $immutable ? 'public, max-age=31536000, immutable' : 'no-cache')
            // Public data fetched by headless frontends on other origins; outside `api/*`, so Laravel's CORS config doesn't cover it.
            ->header('Access-Control-Allow-Origin', '*');
    }
}
