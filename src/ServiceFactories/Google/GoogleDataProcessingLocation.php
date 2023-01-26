<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Symfony\Component\Intl\Countries;

enum GoogleDataProcessingLocation
{
    case USA;
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Google LLC',
            self::IRELAND => 'Google Ireland Limited',
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
