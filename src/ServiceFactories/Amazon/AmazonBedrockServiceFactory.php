<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Amazon;

use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class AmazonBedrockServiceFactory extends ServiceFactory
{
    protected AmazonWebServicesEntity $entity = AmazonWebServicesEntity::USA;

    protected AmazonWebServicesLocation|DataProcessingArea $location = AmazonWebServicesLocation::USA;

    public function entity(AmazonWebServicesEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /**
     * The region of the model, or the area of a cross-region inference profile.
     */
    public function location(AmazonWebServicesLocation|DataProcessingArea $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Amazon Bedrock',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.amazon_bedrock.description'),
            privacyPolicyUrl: 'https://aws.amazon.com/privacy/',
            dataProcessingLocation: $this->location instanceof DataProcessingArea ? $this->location->label() : $this->location->country(),
        );
    }
}
