<?php

namespace Workbench\App\Providers;

use Carbon\Laravel\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Keepsuit\CookieSolution\CookieSolution;
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
use Keepsuit\CookieSolution\ServiceFactories\PayPal\PayPalServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\PostHog\PostHogAnalyticsServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\PostHog\PostHogDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Scalapay\ScalapayServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Stripe\StripeServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Zoho\ZohoCampaignsServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Zoho\ZohoDataProcessingLocation;
use Workbench\App\Http\Middleware\LocaleMiddleware;

class WorkbenchServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->afterResolving(CookieSolution::class, function (CookieSolution $cookieSolution) {
            $cookieSolution
                ->register(AmazonWebServicesServiceFactory::new()->location(AmazonWebServicesLocation::GERMANY)->build())
                ->register(DigitalOceanServiceFactory::new()->location(DigitalOceanLocation::GERMANY)->build())
                ->register(GoogleAdsRemarketingServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
                ->register(GoogleAnalytics4ServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
                ->register(GoogleTagManagerServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
                ->register(KlarnaServiceFactory::new()->build())
                ->register(MailchimpServiceFactory::new()->build())
                ->register(FacebookPixelServiceFactory::new()->location(MetaDataProcessingLocation::IRELAND)->build())
                ->register(PayPalServiceFactory::new()->build())
                ->register(PostHogAnalyticsServiceFactory::new()->location(PostHogDataProcessingLocation::EUROPE)->build())
                ->register(ScalapayServiceFactory::new()->build())
                ->register(StripeServiceFactory::new()->build())
                ->register(ZohoCampaignsServiceFactory::new()->location(ZohoDataProcessingLocation::NEDERLAND)->build());
        });
    }

    public function boot(): void
    {
        $locales = ['en', 'it', 'fr'];

        Route::redirect('/', '/en');

        Route::prefix('{locale}')
            ->whereIn('locale', $locales)
            ->middleware(LocaleMiddleware::class)
            ->group(function () use ($locales) {
                Route::view('/', 'index', [
                    'locales' => $locales,
                ]);
            });
    }
}
