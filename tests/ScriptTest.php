<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\HtmlString;
use Keepsuit\CookieSolution\Facades\CookieSolution;
use Spatie\TestTime\TestTime;

it('outputs script', function () {
    $script = CookieSolution::script();

    expect($script)
        ->toBeInstanceOf(HtmlString::class);

    expect($script->toHtml())
        ->toContain(
            'window._cookieSolution = {',
            '<script type="module" src="/cookie-solution/laravel-cookie-solution.mjs?id='
        );
});

it('provide script from route', function () {
    TestTime::parse('2023-01-01 00:00:00');

    $response = $this->get('/cookie-solution/laravel-cookie-solution.mjs');

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/javascript; charset=utf-8')
        ->assertHeader('Expires', 'Mon, 01 Jan 2024 00:00:00 GMT')
        ->assertHeader('Cache-Control', 'max-age=31536000, public')
        ->assertHeader('Last-Modified', sprintf('%s GMT', gmdate('D, d M Y H:i:s', filemtime(__DIR__.'/../resources/dist/laravel-cookie-solution.mjs'))));

    expect($response->getFile()->getContent())
        ->toBe(File::get(__DIR__.'/../resources/dist/laravel-cookie-solution.mjs'));
});
