<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class GoogleTagManagerServiceFactory extends ServiceFactory
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
            name: 'Google Tag Manager',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.google_tag_manager.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
        );
    }
}
