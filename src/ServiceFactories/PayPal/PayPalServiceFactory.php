<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PayPal;

use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class PayPalServiceFactory extends ServiceFactory
{
    protected PayPalEntity $entity = PayPalEntity::USA;

    public function entity(PayPalEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(): the data is processed worldwide, this only selects the entity. */
    public function location(PayPalDataProcessingLocation $location): static
    {
        $this->entity = $location->entity();

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'PayPal',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.paypal.description'),
            privacyPolicyUrl: 'https://www.paypal.com/legalhub/paypal/privacy-full',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
        );
    }
}
