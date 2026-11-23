<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Stripe;

use Symfony\Component\Intl\Countries;

/**
 * @deprecated Use the factory's `entity()`: the data is processed worldwide, so these cases only select the entity.
 */
enum StripeDataProcessingLocation
{
    case USA;
    case IRELAND;

    /** @deprecated Use StripeEntity. */
    public function entity(): StripeEntity
    {
        return match ($this) {
            self::USA => StripeEntity::USA,
            self::IRELAND => StripeEntity::IRELAND,
        };
    }

    /** @deprecated Use StripeEntity. */
    public function provider(): string
    {
        return $this->entity()->provider();
    }

    /** @deprecated The data is processed worldwide. */
    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::IRELAND => Countries::getName('IE', app()->getLocale()),
        };
    }
}
