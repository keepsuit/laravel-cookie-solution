<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

/**
 * Embedded Google Maps. Its iframe should wait for `marketing`: Google also uses `NID` to show ads to signed-out users.
 */
class GoogleMapsServiceFactory extends ServiceFactory
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
        return new Service(
            name: 'Google Maps',
            provider: $this->entity?->provider() ?? $this->location->provider(),
            description: __('cookie-solution::services.google_maps.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: $this->entity ? DataProcessingArea::WORLDWIDE->label() : $this->location->country(),
            cookies: [
                new Cookie(
                    name: 'NID',
                    purpose: CookiePurpose::MARKETING,
                    duration: 180,
                    description: __('cookie-solution::services.google_maps.cookies.NID'),
                ),
            ],
        );
    }
}
