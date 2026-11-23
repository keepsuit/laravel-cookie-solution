<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Lang;
use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class GoogleAdsRemarketingServiceFactory extends ServiceFactory
{
    protected ?GoogleEntity $entity = null;

    protected GoogleDataProcessingLocation $location = GoogleDataProcessingLocation::USA;

    /**
     * Sets the contracting entity and shows the data processing location as worldwide.
     */
    public function entity(GoogleEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(). */
    public function location(GoogleDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        $cookies = Collection::make([
            '_gcl_au' => 90,
            '_gcl_aw' => 90,
            '_gcl_gs' => 90,
            '_gcl_ag' => 90,
            '_gcl_gb' => 90,
            '_gac_*' => 90,
            '__gads' => 13 * 30,
            'NID' => 6 * 30,
            // EEA/UK lifetime, 24 months elsewhere.
            'IDE' => 13 * 30,
            'DSID' => 14,
        ])->map(function (int $duration, string $name) {
            return new Cookie(
                name: $name,
                purpose: CookiePurpose::MARKETING,
                duration: $duration,
                description: match (true) {
                    str_starts_with($name, '_gcl_'), str_starts_with($name, '_gac_') => __('cookie-solution::services.google_ads_remarketing.cookies._conversion'),
                    Lang::has('cookie-solution::services.google_ads_remarketing.cookies.'.$name) => __('cookie-solution::services.google_ads_remarketing.cookies.'.$name),
                    default => __('cookie-solution::services.google_ads_remarketing.cookies._generic'),
                },
            );
        })->all();

        return new Service(
            name: 'Google Ads Remarketing',
            provider: $this->entity?->provider() ?? $this->location->provider(),
            description: __('cookie-solution::services.google_ads_remarketing.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: $this->entity ? DataProcessingArea::WORLDWIDE->label() : $this->location->country(),
            cookies: $cookies
        );
    }
}
