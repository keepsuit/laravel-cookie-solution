<?php

use Illuminate\Support\Arr;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\ServiceFactories\Amazon\AmazonBedrockServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Amazon\AmazonWebServicesEntity;
use Keepsuit\CookieSolution\ServiceFactories\Amazon\AmazonWebServicesLocation;
use Keepsuit\CookieSolution\ServiceFactories\Amazon\AmazonWebServicesServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Anthropic\AnthropicDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Anthropic\AnthropicEntity;
use Keepsuit\CookieSolution\ServiceFactories\Anthropic\AnthropicServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Cloudflare\CloudflareAiGatewayServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\DigitalOcean\DigitalOceanLocation;
use Keepsuit\CookieSolution\ServiceFactories\DigitalOcean\DigitalOceanServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GeminiServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAdsRemarketingServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleCloudEntity;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleEntity;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleMapsServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleRecaptchaServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleTagManagerServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\YouTubeServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Groq\GroqEntity;
use Keepsuit\CookieSolution\ServiceFactories\Groq\GroqServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Klarna\KlarnaServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Mailchimp\MailchimpServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Meta\FacebookPixelServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Meta\MetaDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Meta\MetaEntity;
use Keepsuit\CookieSolution\ServiceFactories\Microsoft\AzureAiDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Microsoft\AzureAiServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Microsoft\MicrosoftClarityServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Microsoft\MicrosoftEntity;
use Keepsuit\CookieSolution\ServiceFactories\Mistral\MistralDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Mistral\MistralServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\OpenAI\OpenAIDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\OpenAI\OpenAIEntity;
use Keepsuit\CookieSolution\ServiceFactories\OpenAI\OpenAIServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\OpenRouter\OpenRouterDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\OpenRouter\OpenRouterServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\PayPal\PayPalDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\PayPal\PayPalEntity;
use Keepsuit\CookieSolution\ServiceFactories\PayPal\PayPalServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\PostHog\PostHogAnalyticsServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\PostHog\PostHogDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Scalapay\ScalapayServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Stripe\StripeDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Stripe\StripeEntity;
use Keepsuit\CookieSolution\ServiceFactories\Stripe\StripeServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\TypeSafe\TypeSafeServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Vimeo\VimeoServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\XAI\XAIDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\XAI\XAIServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Zoho\ZohoCampaignsServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Zoho\ZohoDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Zoho\ZohoEntity;

function entityFactories(): array
{
    return [
        [AmazonBedrockServiceFactory::class, AmazonWebServicesEntity::class],
        [AnthropicServiceFactory::class, AnthropicEntity::class],
        [AzureAiServiceFactory::class, MicrosoftEntity::class],
        [GeminiServiceFactory::class, GoogleCloudEntity::class],
        [GroqServiceFactory::class, GroqEntity::class],
        [OpenAIServiceFactory::class, OpenAIEntity::class],
        [GoogleAdsRemarketingServiceFactory::class, GoogleEntity::class],
        [GoogleAnalytics4ServiceFactory::class, GoogleEntity::class],
        [GoogleMapsServiceFactory::class, GoogleEntity::class],
        [GoogleRecaptchaServiceFactory::class, GoogleCloudEntity::class],
        [GoogleTagManagerServiceFactory::class, GoogleEntity::class],
        [YouTubeServiceFactory::class, GoogleEntity::class],
        [FacebookPixelServiceFactory::class, MetaEntity::class],
        [PayPalServiceFactory::class, PayPalEntity::class],
        [StripeServiceFactory::class, StripeEntity::class],
        [ZohoCampaignsServiceFactory::class, ZohoEntity::class],
    ];
}

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
        [AnthropicServiceFactory::class, AnthropicDataProcessingLocation::class],
        [AzureAiServiceFactory::class, AzureAiDataProcessingLocation::class],
        [AmazonBedrockServiceFactory::class, AmazonWebServicesLocation::class],
        [AmazonBedrockServiceFactory::class, DataProcessingArea::class],
        [MistralServiceFactory::class, MistralDataProcessingLocation::class],
        [OpenAIServiceFactory::class, OpenAIDataProcessingLocation::class],
        [OpenRouterServiceFactory::class, OpenRouterDataProcessingLocation::class],
        [XAIServiceFactory::class, XAIDataProcessingLocation::class],
    ];

    $services = collect($located)
        ->flatMap(fn (array $pair) => array_map(fn ($location) => $pair[0]::new()->location($location)->build(), $pair[1]::cases()))
        ->merge(collect(entityFactories())->flatMap(fn (array $pair) => array_map(fn ($entity) => $pair[0]::new()->entity($entity)->build(), $pair[1]::cases())))
        ->merge(array_map(fn (string $factory) => $factory::new()->build(), [
            KlarnaServiceFactory::class,
            MailchimpServiceFactory::class,
            MicrosoftClarityServiceFactory::class,
            ScalapayServiceFactory::class,
            CloudflareAiGatewayServiceFactory::class,
            TypeSafeServiceFactory::class,
            VimeoServiceFactory::class,
        ]))
        ->push(VimeoServiceFactory::new()->doNotTrack()->build());

    expect(json_encode($services->map->toArray()))->not->toContain('cookie-solution::');
});

it('prints the entity chosen with entity()', function () {
    foreach (entityFactories() as [$factory, $entities]) {
        foreach ($entities::cases() as $entity) {
            expect($factory::new()->entity($entity)->build()->provider)->toBe($entity->provider());
        }
    }
});

it('has the same service translation keys in every language', function (string $locale) {
    $keys = fn (string $locale) => array_keys(Arr::dot(require __DIR__."/../resources/lang/{$locale}/services.php"));

    expect($keys($locale))->toEqualCanonicalizing($keys('en'));
})->with(['de', 'es', 'fr', 'it']);

it('has the same data processing area translations in every language', function (string $locale) {
    $areas = fn (string $locale) => array_keys((require __DIR__."/../resources/lang/{$locale}/texts.php")['data_processing_areas']);

    expect($areas($locale))->toBe(array_map(fn (DataProcessingArea $area) => $area->value, DataProcessingArea::cases()));
})->with(['de', 'en', 'es', 'fr', 'it']);

it('shows an area as the location of services processed outside a single country', function () {
    app()->setLocale('it');

    expect(OpenAIServiceFactory::new()->build()->dataProcessingLocation)->toBe('In tutto il mondo')
        ->and(OpenAIServiceFactory::new()->location(OpenAIDataProcessingLocation::EUROPE)->build()->dataProcessingLocation)->toBe('Europa')
        ->and(AmazonBedrockServiceFactory::new()->build()->dataProcessingLocation)->toBe('Stati Uniti')
        ->and(AmazonBedrockServiceFactory::new()->location(DataProcessingArea::EUROPE)->build()->dataProcessingLocation)->toBe('Europa');
});

it('links the OpenAI privacy policy of the chosen entity', function () {
    expect(OpenAIServiceFactory::new()->entity(OpenAIEntity::IRELAND)->build())
        ->provider->toBe('OpenAI Ireland Ltd.')
        ->privacyPolicyUrl->toBe('https://openai.com/policies/eu-privacy-policy/');
});

it('keeps the entity and location of the deprecated location option', function () {
    expect(GoogleAnalytics4ServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
        ->provider->toBe('Google Ireland Limited')
        ->dataProcessingLocation->toBe('Ireland');
});

it('maps the deprecated reCAPTCHA location to a Google Cloud entity', function () {
    expect(GoogleRecaptchaServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build()->provider)->toBe('Google Cloud EMEA Limited');
});

it('shows the location as worldwide once the entity is set', function () {
    expect(StripeServiceFactory::new()->location(StripeDataProcessingLocation::IRELAND)->entity(StripeEntity::IRELAND)->build())
        ->provider->toBe('Stripe Payments Europe, Limited')
        ->dataProcessingLocation->toBe('Worldwide');
});

it('sets the Zoho entity independently of the data center', function () {
    expect(ZohoCampaignsServiceFactory::new()->entity(ZohoEntity::GERMANY)->location(ZohoDataProcessingLocation::EUROPE)->build())
        ->provider->toBe('Zoho Corporation GmbH')
        ->dataProcessingLocation->toBe('Europe')
        ->and(ZohoCampaignsServiceFactory::new()->location(ZohoDataProcessingLocation::JAPAN)->build()->provider)->toBe('Zoho Japan Corporation');
});

it('lists only the cookies that secure the Vimeo player with do not track', function () {
    $purposes = fn (VimeoServiceFactory $factory) => collect($factory->build()->cookies)->mapWithKeys(fn ($cookie) => [$cookie->name => $cookie->purpose->value])->all();

    expect($purposes(VimeoServiceFactory::new()))
        ->toMatchArray(['vuid' => 'statistics', 'player' => 'statistics', 'flags' => 'statistics', 'player_clearance' => 'necessary']);

    expect($purposes(VimeoServiceFactory::new()->doNotTrack()))
        ->toBe(['player_clearance' => 'necessary', 'cf_clearance' => 'necessary', '__cf_bm' => 'necessary', '_cfuvid' => 'necessary']);
});

it('marks reCAPTCHA necessary', function () {
    expect(GoogleRecaptchaServiceFactory::new()->build()->cookies[0]->purpose)->toBe(CookiePurpose::NECESSARY);
});

it('changes the purpose of every cookie or of the named ones', function () {
    $purposes = fn ($service) => collect($service->cookies)->mapWithKeys(fn ($cookie) => [$cookie->name => $cookie->purpose->value])->all();
    $youtube = YouTubeServiceFactory::new()->build();

    expect(array_unique($purposes($youtube->withCookiePurposes(CookiePurpose::MARKETING))))->toBe(['YSC' => 'marketing'])
        ->and($purposes($youtube->withCookiePurposes(['PREF' => CookiePurpose::MARKETING])))
        ->toBe([...$purposes($youtube), 'PREF' => 'marketing'])
        ->and($youtube->withCookiePurposes(['PREF' => CookiePurpose::MARKETING])->cookies[2]->duration)->toBe(240);
});

it('rejects a purpose for a cookie the service does not have', function () {
    YouTubeServiceFactory::new()->build()->withCookiePurposes(['PERF' => CookiePurpose::MARKETING]);
})->throws(InvalidArgumentException::class, 'Service "YouTube" has no cookie named "PERF".');
