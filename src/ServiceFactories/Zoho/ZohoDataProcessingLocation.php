<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Zoho;

use Symfony\Component\Intl\Countries;

enum ZohoDataProcessingLocation
{
    case USA;
    case NEDERLAND;
    case AUSTRALIA;
    case INDIA;

    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::NEDERLAND => Countries::getName('NL', app()->getLocale()),
            self::AUSTRALIA => Countries::getName('AU', app()->getLocale()),
            self::INDIA => Countries::getName('IN', app()->getLocale()),
        };
    }
}
