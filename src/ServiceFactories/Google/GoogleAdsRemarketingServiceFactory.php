<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Lang;
use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class GoogleAdsRemarketingServiceFactory extends ServiceFactory
{
    protected GoogleDataProcessingLocation $location = GoogleDataProcessingLocation::USA;

    public function location(GoogleDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        $cookies = Collection::make([
            'NID' => 6 * 30,
            '1P_JAR' => 30,
            'DV' => 1,
            'CONSENT' => 365,
            'APISID' => 2 * 365,
            'SSID' => 2 * 365,
            'HSID' => 2 * 365,
            'SID' => 2 * 365,
            'OGPC' => 7,
            '__gads' => 2 * 365,
            'IDE' => 2 * 365,
            'DSID' => 14,
            '_gcl_aw' => 3 * 30,
            '_gac_*' => 3 * 30,
        ])->map(function (int $duration, string $name) {
            return new Cookie(
                name: $name,
                purpose: CookiePurpose::MARKETING,
                duration: $duration,
                description: Lang::has('cookie-solution::services.google_ads_remarketing.cookies.'.$name)
                    ? __('cookie-solution::services.google_ads_remarketing.cookies.'.$name)
                    : __('cookie-solution::services.google_ads_remarketing.cookies._generic'),
            );
        })->all();

        return new Service(
            name: 'Google Ads Remarketing',
            provider: $this->location->provider(),
            description: __('cookie-solution::services.google_ads_remarketing.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: $this->location->country(),
            cookies: $cookies
        );
    }
}
