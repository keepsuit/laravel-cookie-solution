<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Zoho;

use Symfony\Component\Intl\Countries;

enum ZohoDataProcessingLocation
{
    case AUSTRALIA;
    case CANADA;
    case CHINA;
    case INDIA;
    case JAPAN;
    case NEDERLAND;
    case SAUDI_ARABIA;
    case SINGAPORE;
    case UNITED_ARAB_EMIRATES;
    case USA;

    const NETHERLANDS = self::NEDERLAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Zoho Technologies',
            self::NEDERLAND => 'Zoho Corporation B.V.',
            self::AUSTRALIA => 'Zoho Corporation Pty. Ltd.',
            default => 'Zoho Corporation Pvt. Ltd.',
        };
    }

    public function country(): string
    {
        return match ($this) {
            self::CANADA => Countries::getName('CA', app()->getLocale()),
            self::CHINA => Countries::getName('CN', app()->getLocale()),
            self::JAPAN => Countries::getName('JP', app()->getLocale()),
            self::SAUDI_ARABIA => Countries::getName('SA', app()->getLocale()),
            self::SINGAPORE => Countries::getName('SG', app()->getLocale()),
            self::UNITED_ARAB_EMIRATES => Countries::getName('AE', app()->getLocale()),
            self::USA => Countries::getName('US', app()->getLocale()),
            self::NEDERLAND => Countries::getName('NL', app()->getLocale()),
            self::AUSTRALIA => Countries::getName('AU', app()->getLocale()),
            self::INDIA => Countries::getName('IN', app()->getLocale()),
        };
    }
}
