<?php

namespace Keepsuit\CookieSolution\Controllers;

use Illuminate\Http\JsonResponse;
use Keepsuit\CookieSolution\CookieSolution;

class ApiController
{
    public function config(CookieSolution $cookieSolution): JsonResponse
    {
        return response()->json($cookieSolution->getConfig());
    }

    public function policies(): JsonResponse
    {
        return response()->json([
            'cookie_policy' => $this->render('cookie-solution::cookie-policy'),
            'privacy_policy' => $this->render('cookie-solution::privacy-policy'),
        ]);
    }

    protected function render(string $view): string
    {
        return view($view)->render();
    }
}
