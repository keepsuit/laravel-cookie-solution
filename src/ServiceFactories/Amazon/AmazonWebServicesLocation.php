<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Amazon;

use Symfony\Component\Intl\Countries;

enum AmazonWebServicesLocation
{
    case AUSTRALIA;
    case BAHRAIN;
    case BRAZIL;
    case CANADA;
    case CHINA;
    case FRANCE;
    case GERMANY;
    case GREAT_BRITAIN;
    case INDIA;
    case IRELAND;
    case ITALY;
    case JAPAN;
    case SINAGAPORE;
    case SOUTH_AFRICA;
    case SOUTH_KOREA;
    case SWEEDEN;
    case USA;

    public function country(): string
    {
        return match ($this) {
            self::GREAT_BRITAIN => Countries::getName('GB', app()->getLocale()),
            self::AUSTRALIA => Countries::getName('AU', app()->getLocale()),
            self::BAHRAIN => Countries::getName('BH', app()->getLocale()),
            self::BRAZIL => Countries::getName('BR', app()->getLocale()),
            self::CANADA => Countries::getName('CA', app()->getLocale()),
            self::CHINA => Countries::getName('CN', app()->getLocale()),
            self::FRANCE => Countries::getName('FR', app()->getLocale()),
            self::GERMANY => Countries::getName('DE', app()->getLocale()),
            self::INDIA => Countries::getName('IN', app()->getLocale()),
            self::IRELAND => Countries::getName('IE', app()->getLocale()),
            self::ITALY => Countries::getName('IT', app()->getLocale()),
            self::JAPAN => Countries::getName('JP', app()->getLocale()),
            self::SINAGAPORE => Countries::getName('SG', app()->getLocale()),
            self::SOUTH_AFRICA => Countries::getName('ZA', app()->getLocale()),
            self::SOUTH_KOREA => Countries::getName('KR', app()->getLocale()),
            self::SWEEDEN => Countries::getName('SE', app()->getLocale()),
            self::USA => Countries::getName('US', app()->getLocale()),
        };
    }
}
