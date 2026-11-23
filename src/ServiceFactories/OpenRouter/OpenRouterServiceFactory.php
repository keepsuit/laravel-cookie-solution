<?php

namespace Keepsuit\CookieSolution\ServiceFactories\OpenRouter;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class OpenRouterServiceFactory extends ServiceFactory
{
    protected OpenRouterDataProcessingLocation $location = OpenRouterDataProcessingLocation::WORLDWIDE;

    public function location(OpenRouterDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'OpenRouter',
            provider: 'OpenRouter, Inc.',
            description: __('cookie-solution::services.openrouter.description'),
            privacyPolicyUrl: 'https://openrouter.ai/privacy',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
