<?php

use Illuminate\Routing\RouteCollection;
use Keepsuit\CookieSolution\Facades\CookieSolution;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;
use Keepsuit\CookieSolution\Tests\ApiTestMiddleware;

beforeEach(function () {
    config()->set('cookie-solution.api.path', 'internal/cookie-solution');
    config()->set('cookie-solution.api.middleware', ['api', ApiTestMiddleware::class]);

    // Routes were registered at boot with the default config.
    app('router')->setRoutes(new RouteCollection);
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

    $this->getJson('/internal/cookie-solution/policies?locale=it')
        ->assertOk()
        ->assertJsonPath('cookie_policy', fn (string $html) => str_contains($html, '<h1 part="headings h1">Cookie policy</h1>')
            && str_contains($html, '<cookie-solution-duration duration="730" session-label="Sessione"></cookie-solution-duration>')
            && str_contains($html, '<dt part="cookie-name">_ga</dt>'))
        ->assertJsonPath('privacy_policy', fn (string $html) => str_contains($html, '<h1 part="headings h1">Privacy policy</h1>')
            && str_contains($html, '<span part="service-name">Google Analytics 4</span>'));
});

it('serves the policies with the same markup as the views, without the formatter', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->build());
    config()->set('cookie-solution.data_owner.name_and_address', 'Company');

    $policies = $this->getJson('/internal/cookie-solution/policies')->assertOk()->json();

    expect(view('cookie-solution::cookie-policy')->render())->toContain(trim($policies['cookie_policy']))
        ->and(view('cookie-solution::privacy-policy')->render())->toContain(trim($policies['privacy_policy']))
        ->and($policies['cookie_policy'].$policies['privacy_policy'])
        // Styles target parts: a class would have no CSS behind it.
        ->not->toContain('class=')
        ->not->toContain('cookie-solution-policy-formatter');
});

it('allows any origin on every endpoint', function () {
    $this->getJson('/internal/cookie-solution')->assertHeader('Access-Control-Allow-Origin', '*');
    $this->getJson('/internal/cookie-solution/content')->assertHeader('Access-Control-Allow-Origin', '*');
    $this->getJson('/internal/cookie-solution/policies')->assertHeader('Access-Control-Allow-Origin', '*');
});

it('applies the configured middleware', function () {
    $this->getJson('/internal/cookie-solution')
        ->assertOk()
        ->assertHeader('X-Api-Test', '1');
});

it('reads the locale from the query on every endpoint', function () {
    $this->getJson('/internal/cookie-solution?locale=it')
        ->assertJsonPath('locale', 'it')
        ->assertJsonPath('toggle_label', __('cookie-solution::texts.banner.button_show_banner', locale: 'it'))
        ->assertJsonPath('content_url', fn (string $url) => str_contains($url, '/internal/cookie-solution/content?locale=it&v='));
    $this->getJson('/internal/cookie-solution/content?locale=de')
        ->assertJsonPath('texts.tab_consent', __('cookie-solution::texts.banner.tab_consent', locale: 'de'));
    $this->getJson('/internal/cookie-solution/policies?locale=en')
        ->assertJsonPath('cookie_policy', fn (string $html) => str_contains($html, '<h1 part="headings h1">Cookies policy</h1>'));
});

it('rejects invalid locales', function () {
    $this->get('/internal/cookie-solution/content?locale=it%3Cscript%3E')->assertStatus(422);
    $this->get('/internal/cookie-solution?locale[]=it')->assertStatus(422);
});

it('serves the banner content', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->build());

    $response = $this->getJson('/internal/cookie-solution/content')
        ->assertOk()
        ->assertHeader('Access-Control-Allow-Origin', '*')
        ->assertJsonPath('services.statistics.0.name', 'Google Analytics 4');

    expect($response->headers->get('Cache-Control'))->toContain('no-cache');
});

it('serves the content url from the config as immutable', function () {
    $url = CookieSolution::getConfig()['content_url'];

    $response = $this->getJson($url)->assertOk();

    expect($response->headers->get('Cache-Control'))->toContain('immutable');
});

it('restricts the endpoints to the configured domain', function () {
    config()->set('cookie-solution.api.domain', 'api.example.com');
    app('router')->setRoutes(new RouteCollection);
    require __DIR__.'/../routes/routes.php';

    $this->getJson('http://api.example.com/internal/cookie-solution')->assertOk();
    $this->getJson('http://www.example.com/internal/cookie-solution/policies')->assertNotFound();
});

it('translates services registered on resolving in the requested locale', function () {
    app()->forgetInstance(Keepsuit\CookieSolution\CookieSolution::class);
    app()->afterResolving(Keepsuit\CookieSolution\CookieSolution::class, fn ($cookieSolution) => $cookieSolution->register(GoogleAnalytics4ServiceFactory::new()->build()));

    $this->getJson('/internal/cookie-solution/content?locale=it')
        ->assertJsonPath('services.statistics.0.cookies.0.description', __('cookie-solution::services.google_analytics_4.cookies._ga', locale: 'it'));
});
