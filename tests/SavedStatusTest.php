<?php

use Illuminate\Http\Request;
use Keepsuit\CookieSolution\Facades\CookieSolution;

it('renders the saved status reader with the current config', function () {
    $output = view('cookie-solution::status')->render();

    expect($output)
        ->toContain('window.cookieSolutionSavedStatus=')
        ->toContain('(function (__cookieSolutionConfig) {')
        ->toContain('{"cookie_name":"laravel_cookie_solution","digest":"'.CookieSolution::getConfig()['digest'].'"}');
});

it('renders the same reader whatever the visitor consented to', function () {
    $before = view('cookie-solution::status')->render();

    $request = app('request');
    assert($request instanceof Request);
    $request->cookies->set('laravel_cookie_solution', json_encode([
        'timestamp' => now()->toIso8601String(),
        'digest' => CookieSolution::getConfig()['digest'],
        'purposes' => ['statistics' => true],
    ]));

    expect(view('cookie-solution::status')->render())->toBe($before);
});

it('is rendered by the script and the consent mode views', function (string $view) {
    expect(view($view)->render())->toContain('window.cookieSolutionSavedStatus=');
})->with(['cookie-solution::script', 'cookie-solution::google-consent-mode']);

it('renders nothing when disabled', function () {
    config()->set('cookie-solution.enabled', false);

    expect(trim(view('cookie-solution::status')->render()))->toBe('');
});
