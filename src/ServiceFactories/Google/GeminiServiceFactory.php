<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

/**
 * Gemini Developer API: requests go to a global pool, with no regional option.
 */
class GeminiServiceFactory extends ServiceFactory
{
    protected GoogleCloudEntity $entity = GoogleCloudEntity::USA;

    public function entity(GoogleCloudEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Google Gemini',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.google_gemini.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
        );
    }
}
