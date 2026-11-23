<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Stripe;

use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class StripeServiceFactory extends ServiceFactory
{
    protected StripeEntity $entity = StripeEntity::USA;

    public function entity(StripeEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(): the data is processed worldwide, this only selects the entity. */
    public function location(StripeDataProcessingLocation $location): static
    {
        $this->entity = $location->entity();

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Stripe',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.stripe.description'),
            privacyPolicyUrl: 'https://stripe.com/privacy',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
        );
    }
}
