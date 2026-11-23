<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

/**
 * Contracting entity of the Gemini API paid services, by customer billing address.
 */
enum GeminiEntity
{
    case USA;
    /** EMEA except France, Italy and Poland. */
    case EMEA;
    case FRANCE;
    case ITALY;
    case POLAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Google LLC',
            self::EMEA => 'Google Cloud EMEA Limited',
            self::FRANCE => 'Google Cloud France',
            self::ITALY => 'Google Cloud Italy S.r.l.',
            self::POLAND => 'Google Cloud Poland Sp. z o.o',
        };
    }
}
