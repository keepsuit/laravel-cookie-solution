<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Mistral;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class MistralServiceFactory extends ServiceFactory
{
    protected MistralDataProcessingLocation $location = MistralDataProcessingLocation::EUROPE;

    public function location(MistralDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Mistral AI',
            provider: 'Mistral AI',
            description: __('cookie-solution::services.mistral.description'),
            privacyPolicyUrl: 'https://legal.mistral.ai/terms/privacy-policy',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
