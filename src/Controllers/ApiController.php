<?php

namespace Keepsuit\CookieSolution\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Keepsuit\CookieSolution\CookieSolution;

class ApiController
{
    public function config(Request $request): JsonResponse
    {
        return $this->json($this->cookieSolution($request)->getConfig());
    }

    public function content(Request $request): JsonResponse
    {
        $cookieSolution = $this->cookieSolution($request);

        $immutable = $request->query('v') === $cookieSolution->contentVersion();

        return $this->json($cookieSolution->getContent())
            ->header('Cache-Control', $immutable ? 'public, max-age=31536000, immutable' : 'no-cache');
    }

    public function policies(Request $request): JsonResponse
    {
        $this->applyLocale($request);

        return $this->json([
            'cookie_policy' => $this->render('cookie-solution::api.cookie-policy'),
            'privacy_policy' => $this->render('cookie-solution::api.privacy-policy'),
        ]);
    }

    // Public, cookieless data: any origin may read it. `HandleCors` overrides this when `cors.paths` matches the path.
    protected function json(array $data): JsonResponse
    {
        return response()->json($data)->header('Access-Control-Allow-Origin', '*');
    }

    // Resolved after the locale is set: services registered in `afterResolving` translate their texts when built.
    protected function cookieSolution(Request $request): CookieSolution
    {
        $this->applyLocale($request);

        return app(CookieSolution::class);
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
