<?php

use Keepsuit\CookieSolution\Facades\CookieSolution;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleTagManagerServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Meta\FacebookPixelServiceFactory;
use function Spatie\Snapshots\assertMatchesHtmlSnapshot;

it('can render cookie policy view without cookies', function () {
    $output = view('cookie-solution::cookie-policy')->render();

    assertMatchesHtmlSnapshot($output);
});

it('can render cookie policy view with cookies', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->build())
        ->register(GoogleTagManagerServiceFactory::new()->build())
        ->register(FacebookPixelServiceFactory::new()->build());

    $output = view('cookie-solution::cookie-policy')->render();

    assertMatchesHtmlSnapshot($output);
});

it('can render privacy policy view without services', function () {
    $output = view('cookie-solution::privacy-policy')->render();

    assertMatchesHtmlSnapshot($output);
});

it('can render privacy policy view with services', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->build())
        ->register(GoogleTagManagerServiceFactory::new()->build())
        ->register(FacebookPixelServiceFactory::new()->build());

    $output = view('cookie-solution::privacy-policy')->render();

    assertMatchesHtmlSnapshot($output);
});

it('can render privacy policy view with data owner', function () {
    config()->set('cookie-solution.data_owner', [
        'name_and_address' => <<<'MARKDOWN'
            __Company Name__
            Street 1
            12345 City
            MARKDOWN,
        'contact_email' => 'test@example.com',
    ]);

    $output = view('cookie-solution::privacy-policy')->render();

    assertMatchesHtmlSnapshot($output);
});
