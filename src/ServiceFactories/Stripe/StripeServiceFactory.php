<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Stripe;

use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class StripeServiceFactory extends ServiceFactory
{
    protected ?StripeEntity $entity = null;

    protected StripeDataProcessingLocation $location = StripeDataProcessingLocation::USA;

    /**
     * Sets the contracting entity and shows the data processing location as worldwide.
     */
    public function entity(StripeEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(). */
    public function location(StripeDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Stripe',
            provider: $this->entity?->provider() ?? $this->location->provider(),
            description: __('cookie-solution::services.stripe.description'),
            privacyPolicyUrl: 'https://stripe.com/privacy',
            dataProcessingLocation: $this->entity ? DataProcessingArea::WORLDWIDE->label() : $this->location->country(),
        );
    }
}
