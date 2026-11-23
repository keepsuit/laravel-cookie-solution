<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Symfony\Component\Intl\Countries;

/**
 * @deprecated Use the factory's `entity()` (GoogleEntity, or GoogleCloudEntity for reCAPTCHA), which shows the location as worldwide.
 */
enum GoogleDataProcessingLocation
{
    case USA;
    case IRELAND;

    /** @deprecated Use GoogleEntity. */
    public function provider(): string
    {
        return match ($this) {
            self::USA => GoogleEntity::USA->provider(),
            self::IRELAND => GoogleEntity::IRELAND->provider(),
        };
    }

    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::IRELAND => Countries::getName('IE', app()->getLocale())
        };
    }
}
