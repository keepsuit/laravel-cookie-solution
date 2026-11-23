<?php

namespace Keepsuit\CookieSolution\ServiceFactories\XAI;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class XAIServiceFactory extends ServiceFactory
{
    protected XAIDataProcessingLocation $location = XAIDataProcessingLocation::WORLDWIDE;

    public function location(XAIDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'xAI',
            // xAI's API terms name SpaceX Super Intelligence LLC.
            provider: 'SpaceX Super Intelligence LLC',
            description: __('cookie-solution::services.xai.description'),
            privacyPolicyUrl: 'https://x.ai/legal/privacy-policy',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
