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
