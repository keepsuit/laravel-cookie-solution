<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

/**
 * Contracting entity of the Gemini API paid services, by customer country.
 */
enum GeminiEntity
{
    case USA;
    /** EMEA except France, Italy and Poland. */
    case IRELAND;
    case ITALY;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Google LLC',
            self::IRELAND => 'Google Cloud EMEA Limited',
            self::ITALY => 'Google Cloud Italy S.r.l.',
        };
    }
}
