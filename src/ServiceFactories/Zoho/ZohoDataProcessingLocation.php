<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Zoho;

use Keepsuit\CookieSolution\DataProcessingArea;
use Symfony\Component\Intl\Countries;

/**
 * Zoho data center.
 */
enum ZohoDataProcessingLocation
{
    case AUSTRALIA;
    case CANADA;
    case CHINA;
    /** EU data center (Amsterdam and Dublin). */
    case EUROPE;
    case INDIA;
    case JAPAN;
    /** @deprecated Use EUROPE: the EU data center is also in Ireland. */
    case NETHERLANDS;
    case SAUDI_ARABIA;
    case SINGAPORE;
    case UNITED_ARAB_EMIRATES;
    case UNITED_KINGDOM;
    case USA;

    /** @deprecated Use EUROPE. */
    const NEDERLAND = self::NETHERLANDS;

    /** @deprecated Use ZohoEntity. */
    public function provider(): string
    {
        return match ($this) {
            self::AUSTRALIA => ZohoEntity::AUSTRALIA->provider(),
            self::CANADA => ZohoEntity::CANADA->provider(),
            self::CHINA => ZohoEntity::CHINA->provider(),
            self::EUROPE, self::NETHERLANDS => ZohoEntity::NETHERLANDS->provider(),
            self::INDIA => ZohoEntity::INDIA->provider(),
            self::JAPAN => ZohoEntity::JAPAN->provider(),
            self::SAUDI_ARABIA => ZohoEntity::SAUDI_ARABIA->provider(),
            self::SINGAPORE => ZohoEntity::SINGAPORE->provider(),
            self::UNITED_ARAB_EMIRATES => ZohoEntity::UNITED_ARAB_EMIRATES->provider(),
            self::UNITED_KINGDOM => ZohoEntity::UNITED_KINGDOM->provider(),
            self::USA => ZohoEntity::USA->provider(),
        };
    }

    public function country(): string
    {
        return match ($this) {
            self::AUSTRALIA => Countries::getName('AU', app()->getLocale()),
            self::CANADA => Countries::getName('CA', app()->getLocale()),
            self::CHINA => Countries::getName('CN', app()->getLocale()),
            self::EUROPE, self::NETHERLANDS => DataProcessingArea::EUROPE->label(),
            self::INDIA => Countries::getName('IN', app()->getLocale()),
            self::JAPAN => Countries::getName('JP', app()->getLocale()),
            self::SAUDI_ARABIA => Countries::getName('SA', app()->getLocale()),
            self::SINGAPORE => Countries::getName('SG', app()->getLocale()),
            self::UNITED_ARAB_EMIRATES => Countries::getName('AE', app()->getLocale()),
            self::UNITED_KINGDOM => Countries::getName('GB', app()->getLocale()),
            self::USA => Countries::getName('US', app()->getLocale()),
        };
    }
}
