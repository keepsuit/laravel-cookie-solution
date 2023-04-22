<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Stripe;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class StripeServiceFactory extends ServiceFactory
{
    public function build(): Service
    {
        return new Service(
            name: 'Stripe',
            provider: 'Stripe Inc.',
            description: __('cookie-solution::services.stripe.description'),
            privacyPolicyUrl: 'https://stripe.com/privacy',
        );
    }
}
