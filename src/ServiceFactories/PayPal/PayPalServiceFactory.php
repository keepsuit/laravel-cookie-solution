<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PayPal;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class PayPalServiceFactory extends ServiceFactory
{
    protected PayPalDataProcessingLocation $location = PayPalDataProcessingLocation::USA;

    public function location(PayPalDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'PayPal',
            provider: $this->location->provider(),
            description: __('cookie-solution::services.paypal.description'),
            privacyPolicyUrl: 'https://www.paypal.com/legalhub/paypal/privacy-full',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
