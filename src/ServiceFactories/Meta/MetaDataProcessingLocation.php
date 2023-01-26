<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Meta;

use Symfony\Component\Intl\Countries;

enum MetaDataProcessingLocation
{
    case USA;
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Meta Platforms, Inc.',
            self::IRELAND => 'Meta Platforms Ireland Limited',
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
