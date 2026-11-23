<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class GoogleTagManagerServiceFactory extends ServiceFactory
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
            name: 'Google Tag Manager',
            provider: $this->entity?->provider() ?? $this->location->provider(),
            description: __('cookie-solution::services.google_tag_manager.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: $this->entity ? DataProcessingArea::WORLDWIDE->label() : $this->location->country(),
        );
    }
}
