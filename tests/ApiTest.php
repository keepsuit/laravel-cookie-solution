<?php

use Keepsuit\CookieSolution\Facades\CookieSolution;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;
use Keepsuit\CookieSolution\Tests\ApiTestMiddleware;

beforeEach(function () {
    config()->set('cookie-solution.api_route', 'internal/cookie-solution');
    config()->set('cookie-solution.api_middleware', ['api', ApiTestMiddleware::class]);

    require __DIR__.'/../routes/routes.php';
});

it('serves the config', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->build());

    $this->getJson('/internal/cookie-solution')
        ->assertOk()
        ->assertExactJson(json_decode(json_encode(CookieSolution::getConfig()), true));
});

it('serves the rendered policies', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->build());

    $this->getJson('/internal/cookie-solution/policies')
        ->assertOk()
        ->assertExactJson([
            'cookie_policy' => view('cookie-solution::cookie-policy')->render(),
            'privacy_policy' => view('cookie-solution::privacy-policy')->render(),
        ]);
});

it('applies the configured middleware and locale', function () {
    $this->getJson('/internal/cookie-solution')
        ->assertOk()
        ->assertHeader('X-Api-Test', '1')
        ->assertJsonPath('texts.tab_consent', __('cookie-solution::texts.banner.tab_consent', locale: 'it'));
});
