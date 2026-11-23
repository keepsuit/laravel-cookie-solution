<?php

namespace Keepsuit\CookieSolution\ServiceFactories\OpenAI;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class OpenAIServiceFactory extends ServiceFactory
{
    protected OpenAIEntity $entity = OpenAIEntity::USA;

    protected OpenAIDataProcessingLocation $location = OpenAIDataProcessingLocation::WORLDWIDE;

    public function entity(OpenAIEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    public function location(OpenAIDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'OpenAI',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.openai.description'),
            privacyPolicyUrl: $this->entity->privacyPolicyUrl(),
            dataProcessingLocation: $this->location->country(),
        );
    }
}
