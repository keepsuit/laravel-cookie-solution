<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Meta;

use Symfony\Component\Intl\Countries;

/**
 * @deprecated Use the factory's `entity()`: the data is processed worldwide, so these cases only select the entity.
 */
enum MetaDataProcessingLocation
{
    case USA;
    case IRELAND;

    /** @deprecated Use MetaEntity. */
    public function entity(): MetaEntity
    {
        return match ($this) {
            self::USA => MetaEntity::USA,
            self::IRELAND => MetaEntity::IRELAND,
        };
    }

    /** @deprecated Use MetaEntity. */
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
