<?php

use Illuminate\Support\Arr;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\ServiceFactories\Amazon\AmazonWebServicesLocation;
use Keepsuit\CookieSolution\ServiceFactories\Amazon\AmazonWebServicesServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\DigitalOcean\DigitalOceanLocation;
use Keepsuit\CookieSolution\ServiceFactories\DigitalOcean\DigitalOceanServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAdsRemarketingServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleMapsServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleRecaptchaServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleTagManagerServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\YouTubeServiceFactory;
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
use Keepsuit\CookieSolution\ServiceFactories\Vimeo\VimeoServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Zoho\ZohoCampaignsServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Zoho\ZohoDataProcessingLocation;

it('builds every service in every location without untranslated keys', function () {
    $located = [
        [AmazonWebServicesServiceFactory::class, AmazonWebServicesLocation::class],
        [DigitalOceanServiceFactory::class, DigitalOceanLocation::class],
        [GoogleAdsRemarketingServiceFactory::class, GoogleDataProcessingLocation::class],
        [GoogleAnalytics4ServiceFactory::class, GoogleDataProcessingLocation::class],
        [GoogleMapsServiceFactory::class, GoogleDataProcessingLocation::class],
        [GoogleRecaptchaServiceFactory::class, GoogleDataProcessingLocation::class],
        [GoogleTagManagerServiceFactory::class, GoogleDataProcessingLocation::class],
        [YouTubeServiceFactory::class, GoogleDataProcessingLocation::class],
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
            VimeoServiceFactory::class,
        ]))
        ->push(VimeoServiceFactory::new()->doNotTrack()->build());

    expect(json_encode($services->map->toArray()))->not->toContain('cookie-solution::');
});

it('has the same service translation keys in every language', function (string $locale) {
    $keys = fn (string $locale) => array_keys(Arr::dot(require __DIR__."/../resources/lang/{$locale}/services.php"));

    expect($keys($locale))->toEqualCanonicalizing($keys('en'));
})->with(['de', 'es', 'fr', 'it']);

it('lists only the cookies that secure the Vimeo player with do not track', function () {
    $purposes = fn (VimeoServiceFactory $factory) => collect($factory->build()->cookies)->mapWithKeys(fn ($cookie) => [$cookie->name => $cookie->purpose->value])->all();

    expect($purposes(VimeoServiceFactory::new()))
        ->toMatchArray(['vuid' => 'statistics', 'player' => 'statistics', 'flags' => 'statistics', 'player_clearance' => 'necessary']);

    expect($purposes(VimeoServiceFactory::new()->doNotTrack()))
        ->toBe(['player_clearance' => 'necessary', 'cf_clearance' => 'necessary', '__cf_bm' => 'necessary', '_cfuvid' => 'necessary']);
});

it('marks reCAPTCHA necessary unless another purpose is chosen', function () {
    expect(GoogleRecaptchaServiceFactory::new()->build()->cookies[0]->purpose)->toBe(CookiePurpose::NECESSARY)
        ->and(GoogleRecaptchaServiceFactory::new()->purpose(CookiePurpose::MARKETING)->build()->cookies[0]->purpose)->toBe(CookiePurpose::MARKETING);
});
