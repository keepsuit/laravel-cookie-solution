<?php

use Keepsuit\CookieSolution\Facades\CookieSolution;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;

it('serves the banner content in the requested locale', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->build());

    $response = $this->getJson('/cookie-solution/content/it')
        ->assertOk()
        ->assertHeader('Access-Control-Allow-Origin', '*')
        ->assertJsonPath('texts.tab_consent', __('cookie-solution::texts.banner.tab_consent', locale: 'it'))
        ->assertJsonPath('services.statistics.0.name', 'Google Analytics 4');

    expect($response->headers->get('Cache-Control'))->toContain('no-cache');
});

it('serves the content url from the config as immutable', function () {
    $url = CookieSolution::getConfig()['content_url'];

    $response = $this->getJson($url)->assertOk();

    expect($response->headers->get('Cache-Control'))->toContain('immutable');
});

it('rejects invalid locales', function () {
    $this->getJson('/cookie-solution/content/../secret')->assertNotFound();
    $this->getJson('/cookie-solution/content/it%3Cscript%3E')->assertNotFound();
});
