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
    protected GoogleEntity $entity = GoogleEntity::USA;

    public function entity(GoogleEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(): the data is processed worldwide, this only selects the entity. */
    public function location(GoogleDataProcessingLocation $location): static
    {
        $this->entity = $location->entity();

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Google Maps',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.google_maps.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
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
