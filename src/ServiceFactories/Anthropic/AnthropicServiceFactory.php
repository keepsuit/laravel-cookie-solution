<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Anthropic;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class AnthropicServiceFactory extends ServiceFactory
{
    protected AnthropicEntity $entity = AnthropicEntity::USA;

    protected AnthropicDataProcessingLocation $location = AnthropicDataProcessingLocation::WORLDWIDE;

    public function entity(AnthropicEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    public function location(AnthropicDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Anthropic',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.anthropic.description'),
            privacyPolicyUrl: 'https://www.anthropic.com/legal/privacy',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
