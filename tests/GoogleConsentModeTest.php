<?php

use Illuminate\Http\Request;
use Keepsuit\CookieSolution\Facades\CookieSolution;

function setStatusCookie(array $purposes): void
{
    $request = app('request');
    assert($request instanceof Request);
    $request->cookies->set('laravel_cookie_solution', json_encode([
        'timestamp' => now()->toIso8601String(),
        'digest' => CookieSolution::getConfig()['digest'],
        'purposes' => $purposes,
    ]));
}

it('denies consent by default when nothing was chosen', function () {
    $output = view('cookie-solution::google-consent-mode')->render();

    expect($output)
        ->toContain('function gtag()', "gtag('consent', 'default'", 'wait_for_update: 500')
        ->toContain('"necessary":false,"preferences":false,"statistics":false,"marketing":false')
        ->toContain("document.addEventListener('cookie-solution-status-change'")
        ->toContain("gtag('consent', 'update'")
        ->toContain("dataLayer.push({ event: 'cookie-solution-status-change', status: event.detail.purposes })");
});

it('grants consent for the accepted purposes', function () {
    setStatusCookie(['statistics' => true, 'marketing' => false]);

    expect(view('cookie-solution::google-consent-mode')->render())
        ->toContain('"necessary":false,"preferences":false,"statistics":true,"marketing":false');
});

it('renders nothing when disabled', function () {
    config()->set('cookie-solution.enabled', false);

    expect(trim(view('cookie-solution::google-consent-mode')->render()))->toBe('');
});
