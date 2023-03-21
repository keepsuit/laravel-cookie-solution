<?php

namespace Keepsuit\CookieSolution\ServiceFactories\DigitalOcean;

use Symfony\Component\Intl\Countries;

enum DigitalOceanLocation
{
    case AUSTRALIA;
    case CANADA;
    case GERMANY;
    case GREAT_BRITAIN;
    case INDIA;
    case NEDERLANDS;
    case SINAGAPORE;
    case USA;

    public function country(): string
    {
        return match ($this) {
            self::GREAT_BRITAIN => Countries::getName('GB', app()->getLocale()),
            self::AUSTRALIA => Countries::getName('AU', app()->getLocale()),
            self::CANADA => Countries::getName('CA', app()->getLocale()),
            self::GERMANY => Countries::getName('DE', app()->getLocale()),
            self::INDIA => Countries::getName('IN', app()->getLocale()),
            self::NEDERLANDS => Countries::getName('NL', app()->getLocale()),
            self::SINAGAPORE => Countries::getName('SG', app()->getLocale()),
            self::USA => Countries::getName('US', app()->getLocale()),
        };
    }
}
