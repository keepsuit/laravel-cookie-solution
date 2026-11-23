<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PayPal;

use Symfony\Component\Intl\Countries;

/**
 * @deprecated Use the factory's `entity()` with PayPalEntity, which shows the location as worldwide.
 */
enum PayPalDataProcessingLocation
{
    case USA;
    case LUXEMBOURG;

    /** @deprecated Use PayPalEntity. */
    public function provider(): string
    {
        return match ($this) {
            self::USA => PayPalEntity::USA->provider(),
            self::LUXEMBOURG => PayPalEntity::LUXEMBOURG->provider(),
        };
    }

    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::LUXEMBOURG => Countries::getName('LU', app()->getLocale()),
        };
    }
}
