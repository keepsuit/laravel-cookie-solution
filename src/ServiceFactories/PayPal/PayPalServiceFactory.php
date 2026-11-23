<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PayPal;

use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class PayPalServiceFactory extends ServiceFactory
{
    protected ?PayPalEntity $entity = null;

    protected PayPalDataProcessingLocation $location = PayPalDataProcessingLocation::USA;

    /**
     * Sets the contracting entity and shows the data processing location as worldwide.
     */
    public function entity(PayPalEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(). */
    public function location(PayPalDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'PayPal',
            provider: $this->entity?->provider() ?? $this->location->provider(),
            description: __('cookie-solution::services.paypal.description'),
            privacyPolicyUrl: 'https://www.paypal.com/legalhub/paypal/privacy-full',
            dataProcessingLocation: $this->entity ? DataProcessingArea::WORLDWIDE->label() : $this->location->country(),
        );
    }
}
