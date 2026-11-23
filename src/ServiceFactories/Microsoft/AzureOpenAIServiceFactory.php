<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Microsoft;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class AzureOpenAIServiceFactory extends ServiceFactory
{
    protected MicrosoftEntity $entity = MicrosoftEntity::USA;

    protected AzureOpenAIDataProcessingLocation $location = AzureOpenAIDataProcessingLocation::WORLDWIDE;

    public function entity(MicrosoftEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    public function location(AzureOpenAIDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Azure OpenAI',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.azure_openai.description'),
            privacyPolicyUrl: 'https://www.microsoft.com/privacy/privacystatement',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
