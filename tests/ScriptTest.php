<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\HtmlString;
use Keepsuit\CookieSolution\CookieSolutionAssets;
use Keepsuit\CookieSolution\Facades\CookieSolution;
use Spatie\TestTime\TestTime;

it('outputs script', function () {
    $script = CookieSolution::script();

    expect($script)
        ->toBeInstanceOf(HtmlString::class);

    expect($script->toHtml())
        ->toContain(
            '<script>',
            'window._cookieSolution = {',
            '<script defer src="/cookie-solution/laravel-cookie-solution.js?id='
        );
});

it('outputs nothing when disabled', function () {
    config()->set('cookie-solution.enabled', false);

    expect(trim(CookieSolution::script()->toHtml()))->toBe('');
});

it('provide script from route', function () {
    TestTime::parse('2023-01-01 00:00:00');

    $response = $this->get('/cookie-solution/laravel-cookie-solution.js');

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/javascript; charset=utf-8')
        ->assertHeader('Expires', 'Mon, 01 Jan 2024 00:00:00 GMT')
        ->assertHeader('Cache-Control', 'max-age=31536000, public')
        ->assertHeader('Last-Modified', sprintf('%s GMT', gmdate('D, d M Y H:i:s', filemtime(__DIR__.'/../resources/dist/laravel-cookie-solution.js'))));

    expect($response->getFile()->getContent())
        ->toBe(File::get(__DIR__.'/../resources/dist/laravel-cookie-solution.js'));
});

describe('published assets', function () {
    beforeEach(function () {
        $this->publishedPath = public_path('vendor/cookie-solution');
        File::ensureDirectoryExists($this->publishedPath);
        File::put($this->publishedPath.'/manifest.json', json_encode(['laravel-cookie-solution.js' => 'laravel-cookie-solution.js?id=published']));
        File::put($this->publishedPath.'/laravel-cookie-solution.js', 'published');
        app()->forgetInstance(CookieSolutionAssets::class);
    });

    afterEach(function () {
        File::deleteDirectory(public_path('vendor/cookie-solution'));
        app()->forgetInstance(CookieSolutionAssets::class);
    });

    it('uses published assets when the manifest is published', function () {
        config()->set('app.asset_url', 'https://cdn.example.com');

        expect(CookieSolution::script()->toHtml())
            ->toContain('src="https://cdn.example.com/vendor/cookie-solution/laravel-cookie-solution.js?id=published"');

        expect(app(CookieSolutionAssets::class)->getScriptFilePath())
            ->toBe(public_path('vendor/cookie-solution/laravel-cookie-solution.js'));
    });

    it('falls back to the package route when the manifest is removed', function () {
        File::delete($this->publishedPath.'/manifest.json');
        app()->forgetInstance(CookieSolutionAssets::class);

        expect(CookieSolution::script()->toHtml())
            ->toContain('src="/cookie-solution/laravel-cookie-solution.js?id=');

        expect(realpath(app(CookieSolutionAssets::class)->getScriptFilePath()))
            ->toBe(realpath(__DIR__.'/../resources/dist/laravel-cookie-solution.js'));
    });
});
