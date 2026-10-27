<?php

use Illuminate\Routing\RouteCollection;
use Keepsuit\CookieSolution\Facades\CookieSolution;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;
use Keepsuit\CookieSolution\Tests\ApiTestMiddleware;

beforeEach(function () {
    config()->set('cookie-solution.api.enabled', true);
    config()->set('cookie-solution.api.path', 'internal/cookie-solution');
    config()->set('cookie-solution.api.middleware', ['api', ApiTestMiddleware::class]);

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
        ->assertJsonPath('cookie_policy', fn (string $html) => str_contains($html, '<h1>Cookie policy</h1>')
            && str_contains($html, '<cookie-solution-duration duration="730" session-label="Sessione"></cookie-solution-duration>')
            && str_contains($html, '<dt>_ga</dt>'))
        ->assertJsonPath('privacy_policy', fn (string $html) => str_contains($html, '<h1>Privacy policy</h1>')
            && str_contains($html, '<h3>Google Analytics 4 (Google LLC)</h3>'));
});

it('serves the policies without styling hooks', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->build());
    config()->set('cookie-solution.data_owner.name_and_address', 'Company');

    $policies = $this->getJson('/internal/cookie-solution/policies')->assertOk()->json();

    expect($policies['cookie_policy'].$policies['privacy_policy'])
        ->not->toContain('part=')
        ->not->toContain('class=')
        ->not->toContain('cookie-solution-policy-formatter');
});

it('applies the configured middleware and locale', function () {
    $this->getJson('/internal/cookie-solution')
        ->assertOk()
        ->assertHeader('X-Api-Test', '1')
        ->assertJsonPath('texts.tab_consent', __('cookie-solution::texts.banner.tab_consent', locale: 'it'));
});

it('restricts the endpoints to the configured domain', function () {
    config()->set('cookie-solution.api.domain', 'api.example.com');
    app('router')->setRoutes(new RouteCollection);
    require __DIR__.'/../routes/routes.php';

    $this->getJson('http://api.example.com/internal/cookie-solution')->assertOk();
    $this->getJson('http://www.example.com/internal/cookie-solution/policies')->assertNotFound();
});
