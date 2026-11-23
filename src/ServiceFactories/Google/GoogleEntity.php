<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

/**
 * Google entity for Analytics, Tag Manager, Ads and embeds (for embeds it follows the visitor's country).
 */
enum GoogleEntity
{
    case USA;
    /** EEA, Swiss and UK customers; for embeds, EEA and Swiss visitors. */
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Google LLC',
            self::IRELAND => 'Google Ireland Limited',
        };
    }
}
