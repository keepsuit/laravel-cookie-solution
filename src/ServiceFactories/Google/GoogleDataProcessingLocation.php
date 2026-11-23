<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Symfony\Component\Intl\Countries;

/**
 * @deprecated Use the factory's `entity()`: the data is processed worldwide, so these cases only select the entity.
 */
enum GoogleDataProcessingLocation
{
    case USA;
    case IRELAND;

    /** @deprecated Use GoogleEntity. */
    public function entity(): GoogleEntity
    {
        return match ($this) {
            self::USA => GoogleEntity::USA,
            self::IRELAND => GoogleEntity::IRELAND,
        };
    }

    /** @deprecated Use GoogleEntity. */
    public function provider(): string
    {
        return $this->entity()->provider();
    }

    /** @deprecated The data is processed worldwide. */
    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::IRELAND => Countries::getName('IE', app()->getLocale())
        };
    }
}
