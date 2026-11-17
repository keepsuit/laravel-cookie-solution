<?php

use Illuminate\Http\Request;
use Keepsuit\CookieSolution\Facades\CookieSolution;

it('reads the stored consent in the browser', function () {
    $output = view('cookie-solution::google-consent-mode')->render();

    expect($output)
        ->toContain('function gtag()', "gtag('consent', 'default'", 'wait_for_update: 500')
        ->toContain('window.cookieSolutionSavedStatus=')
        ->toContain('var status = window.cookieSolutionSavedStatus();')
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

it('renders no optional consent mode settings by default', function () {
    expect(view('cookie-solution::google-consent-mode')->render())
        ->not->toContain("gtag('set'");
});

it('renders the configured consent mode options', function () {
    config()->set('cookie-solution.google_consent_mode', [
        'wait_for_update' => 1000,
        'url_passthrough' => true,
        'ads_data_redaction' => true,
    ]);

    expect(view('cookie-solution::google-consent-mode')->render())
        ->toContain('wait_for_update: 1000')
        ->toContain("gtag('set', 'url_passthrough', true);")
        ->toContain("gtag('set', 'ads_data_redaction', true);");
});

it('keeps the defaults when the published config has no consent mode options', function () {
    config()->set('cookie-solution.google_consent_mode', null);

    expect(view('cookie-solution::google-consent-mode')->render())
        ->toContain('wait_for_update: 500')
        ->not->toContain("gtag('set'");
});
