<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Stripe;

use Symfony\Component\Intl\Countries;

/**
 * @deprecated Use the factory's `entity()` with StripeEntity, which shows the location as worldwide.
 */
enum StripeDataProcessingLocation
{
    case USA;
    case IRELAND;

    /** @deprecated Use StripeEntity. */
    public function provider(): string
    {
        return match ($this) {
            self::USA => StripeEntity::USA->provider(),
            self::IRELAND => StripeEntity::IRELAND->provider(),
        };
    }

    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::IRELAND => Countries::getName('IE', app()->getLocale()),
        };
    }
}
