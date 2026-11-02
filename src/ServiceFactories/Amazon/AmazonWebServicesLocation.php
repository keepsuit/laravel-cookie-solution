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
    case HONG_KONG;
    case INDIA;
    case INDONESIA;
    case IRELAND;
    case ISRAEL;
    case ITALY;
    case JAPAN;
    case MALAYSIA;
    case MEXICO;
    case NEW_ZEALAND;
    case SINAGAPORE;
    case SOUTH_AFRICA;
    case SOUTH_KOREA;
    case SPAIN;
    case SWEEDEN;
    case SWITZERLAND;
    case TAIWAN;
    case THAILAND;
    case UNITED_ARAB_EMIRATES;
    case USA;

    const SINGAPORE = self::SINAGAPORE;

    const SWEDEN = self::SWEEDEN;

    public function country(): string
    {
        return match ($this) {
            self::HONG_KONG => Countries::getName('HK', app()->getLocale()),
            self::INDONESIA => Countries::getName('ID', app()->getLocale()),
            self::ISRAEL => Countries::getName('IL', app()->getLocale()),
            self::MALAYSIA => Countries::getName('MY', app()->getLocale()),
            self::MEXICO => Countries::getName('MX', app()->getLocale()),
            self::NEW_ZEALAND => Countries::getName('NZ', app()->getLocale()),
            self::SPAIN => Countries::getName('ES', app()->getLocale()),
            self::SWITZERLAND => Countries::getName('CH', app()->getLocale()),
            self::TAIWAN => Countries::getName('TW', app()->getLocale()),
            self::THAILAND => Countries::getName('TH', app()->getLocale()),
            self::UNITED_ARAB_EMIRATES => Countries::getName('AE', app()->getLocale()),
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
