<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Stripe;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class StripeServiceFactory extends ServiceFactory
{
    protected StripeDataProcessingLocation $location = StripeDataProcessingLocation::USA;

    public function location(StripeDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Stripe',
            provider: $this->location->provider(),
            description: __('cookie-solution::services.stripe.description'),
            privacyPolicyUrl: 'https://stripe.com/privacy',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
