<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Meta;

use Symfony\Component\Intl\Countries;

/**
 * @deprecated Use the factory's `entity()` with MetaEntity, which shows the location as worldwide.
 */
enum MetaDataProcessingLocation
{
    case USA;
    case IRELAND;

    /** @deprecated Use MetaEntity. */
    public function provider(): string
    {
        return match ($this) {
            self::USA => MetaEntity::USA->provider(),
            self::IRELAND => MetaEntity::IRELAND->provider(),
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
