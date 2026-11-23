<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PayPal;

use Symfony\Component\Intl\Countries;

/**
 * @deprecated Use the factory's `entity()`: the data is processed worldwide, so these cases only select the entity.
 */
enum PayPalDataProcessingLocation
{
    case USA;
    case LUXEMBOURG;

    /** @deprecated Use PayPalEntity. */
    public function entity(): PayPalEntity
    {
        return match ($this) {
            self::USA => PayPalEntity::USA,
            self::LUXEMBOURG => PayPalEntity::LUXEMBOURG,
        };
    }

    /** @deprecated Use PayPalEntity. */
    public function provider(): string
    {
        return $this->entity()->provider();
    }

    /** @deprecated The data is processed worldwide. */
    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::LUXEMBOURG => Countries::getName('LU', app()->getLocale()),
        };
    }
}
