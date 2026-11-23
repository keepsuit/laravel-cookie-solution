<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Microsoft;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

/**
 * Models deployed on Azure, now branded Microsoft Foundry (formerly Azure OpenAI and Azure AI Foundry).
 */
class AzureAiServiceFactory extends ServiceFactory
{
    protected MicrosoftEntity $entity = MicrosoftEntity::USA;

    protected AzureAiDataProcessingLocation $location = AzureAiDataProcessingLocation::WORLDWIDE;

    public function entity(MicrosoftEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    public function location(AzureAiDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Azure AI',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.azure_ai.description'),
            privacyPolicyUrl: 'https://www.microsoft.com/privacy/privacystatement',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
