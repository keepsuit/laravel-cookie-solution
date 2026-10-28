<?php

use Illuminate\Http\Request;
use Keepsuit\CookieSolution\Facades\CookieSolution;

it('reads the stored consent in the browser', function () {
    $output = view('cookie-solution::google-consent-mode')->render();

    expect($output)
        ->toContain('function gtag()', "gtag('consent', 'default'", 'wait_for_update: 500')
        ->toContain('var cookieName = "laravel_cookie_solution";')
        ->toContain('var digest = "'.CookieSolution::getConfig()['digest'].'";')
        ->toContain("document.addEventListener('cookie-solution-status-change'")
        ->toContain("gtag('consent', 'update'")
        ->toContain("dataLayer.push({ event: 'cookie-solution-status-change', status: event.detail.purposes })");
});

it('renders the same output whatever the visitor consented to', function () {
    $before = view('cookie-solution::google-consent-mode')->render();

    $request = app('request');
    assert($request instanceof Request);
    $request->cookies->set('laravel_cookie_solution', json_encode([
        'timestamp' => now()->toIso8601String(),
        'digest' => CookieSolution::getConfig()['digest'],
        'purposes' => ['statistics' => true, 'marketing' => true],
    ]));

    expect(view('cookie-solution::google-consent-mode')->render())->toBe($before);
});

it('renders nothing when disabled', function () {
    config()->set('cookie-solution.enabled', false);

    expect(trim(view('cookie-solution::google-consent-mode')->render()))->toBe('');
});
