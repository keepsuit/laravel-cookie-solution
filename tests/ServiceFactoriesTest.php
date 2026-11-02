<?php

use Illuminate\Support\Arr;
use Keepsuit\CookieSolution\ServiceFactories\Amazon\AmazonWebServicesLocation;
use Keepsuit\CookieSolution\ServiceFactories\Amazon\AmazonWebServicesServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\DigitalOcean\DigitalOceanLocation;
use Keepsuit\CookieSolution\ServiceFactories\DigitalOcean\DigitalOceanServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAdsRemarketingServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleTagManagerServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Klarna\KlarnaServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Mailchimp\MailchimpServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Meta\FacebookPixelServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Meta\MetaDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Microsoft\MicrosoftClarityServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\PayPal\PayPalDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\PayPal\PayPalServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\PostHog\PostHogAnalyticsServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\PostHog\PostHogDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Scalapay\ScalapayServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Stripe\StripeDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Stripe\StripeServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Zoho\ZohoCampaignsServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Zoho\ZohoDataProcessingLocation;

it('builds every service in every location without untranslated keys', function () {
    $located = [
        [AmazonWebServicesServiceFactory::class, AmazonWebServicesLocation::class],
        [DigitalOceanServiceFactory::class, DigitalOceanLocation::class],
        [GoogleAdsRemarketingServiceFactory::class, GoogleDataProcessingLocation::class],
        [GoogleAnalytics4ServiceFactory::class, GoogleDataProcessingLocation::class],
        [GoogleTagManagerServiceFactory::class, GoogleDataProcessingLocation::class],
        [FacebookPixelServiceFactory::class, MetaDataProcessingLocation::class],
        [PayPalServiceFactory::class, PayPalDataProcessingLocation::class],
        [PostHogAnalyticsServiceFactory::class, PostHogDataProcessingLocation::class],
        [StripeServiceFactory::class, StripeDataProcessingLocation::class],
        [ZohoCampaignsServiceFactory::class, ZohoDataProcessingLocation::class],
    ];

    $services = collect($located)
        ->flatMap(fn (array $pair) => array_map(fn ($location) => $pair[0]::new()->location($location)->build(), $pair[1]::cases()))
        ->merge(array_map(fn (string $factory) => $factory::new()->build(), [
            KlarnaServiceFactory::class,
            MailchimpServiceFactory::class,
            MicrosoftClarityServiceFactory::class,
            ScalapayServiceFactory::class,
        ]));

    expect(json_encode($services->map->toArray()))->not->toContain('cookie-solution::');
});

it('has the same service translation keys in every language', function (string $locale) {
    $keys = fn (string $locale) => array_keys(Arr::dot(require __DIR__."/../resources/lang/{$locale}/services.php"));

    expect($keys($locale))->toEqualCanonicalizing($keys('en'));
})->with(['de', 'es', 'fr', 'it']);
