<?php

namespace Keepsuit\CookieSolution\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Keepsuit\CookieSolution\CookieSolution;

class ApiController
{
    public function config(Request $request, CookieSolution $cookieSolution): JsonResponse
    {
        $this->applyLocale($request);

        return response()->json($cookieSolution->getConfig());
    }

    public function content(Request $request, CookieSolution $cookieSolution): JsonResponse
    {
        $this->applyLocale($request);

        $immutable = $request->query('v') === $cookieSolution->contentVersion();

        return response()
            ->json($cookieSolution->getContent())
            ->header('Cache-Control', $immutable ? 'public, max-age=31536000, immutable' : 'no-cache')
            // Also fetched by Blade banners when `api.domain` differs from the site domain.
            ->header('Access-Control-Allow-Origin', '*');
    }

    public function policies(Request $request): JsonResponse
    {
        $this->applyLocale($request);

        return response()->json([
            'cookie_policy' => $this->render('cookie-solution::api.cookie-policy'),
            'privacy_policy' => $this->render('cookie-solution::api.privacy-policy'),
        ]);
    }

    // The locale comes from the URL, so the URL alone identifies a response and caches need no `Vary`.
    protected function applyLocale(Request $request): void
    {
        $locale = $request->query('locale');

        if ($locale === null) {
            return;
        }

        // Not `$request->validate()`: it would redirect plain `fetch()` requests instead of failing.
        abort_unless(is_string($locale) && preg_match('/^[A-Za-z]{2,3}([_-][A-Za-z0-9]{2,8})*$/', $locale), 422);

        app()->setLocale($locale);
    }

    protected function render(string $view): string
    {
        // Policy markdown carries `part` hooks meant for the styled views only.
        return preg_replace('/\s+part="[^"]*"/', '', view($view)->render());
    }
}
