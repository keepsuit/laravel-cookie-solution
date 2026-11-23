<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Zoho;

/**
 * Zoho contracting entity, by customer country (independent of the data center).
 */
enum ZohoEntity
{
    case USA;
    /** EEA customers. */
    case NETHERLANDS;
    /** German, Austrian, Swiss and Liechtenstein customers. */
    case GERMANY;
    case UNITED_KINGDOM;
    case INDIA;
    /** Australian and New Zealand customers. */
    case AUSTRALIA;
    case JAPAN;
    case CANADA;
    case CHINA;
    case SAUDI_ARABIA;
    case UNITED_ARAB_EMIRATES;
    /** Singapore and countries without a dedicated entity. */
    case SINGAPORE;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Zoho Corporation',
            self::NETHERLANDS => 'Zoho Corporation B.V.',
            self::GERMANY => 'Zoho Corporation GmbH',
            self::UNITED_KINGDOM => 'Zoho Corporation Limited',
            self::INDIA => 'Zoho Corporation Private Limited',
            self::AUSTRALIA => 'Zoho Corporation Pty Limited',
            self::JAPAN => 'Zoho Japan Corporation',
            self::CANADA => 'Zoho Canada Corporation',
            self::CHINA => 'Zoho (China) Technology Co., Limited',
            self::SAUDI_ARABIA => 'Zoho Technologies Company',
            self::UNITED_ARAB_EMIRATES => 'Zoho Software Trading L.L.C',
            self::SINGAPORE => 'Zoho Corporation Pte. Ltd.',
        };
    }
}
