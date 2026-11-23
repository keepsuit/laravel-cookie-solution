<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

/**
 * Google Cloud contracting entity (Gemini API, reCAPTCHA), by customer billing address.
 */
enum GoogleCloudEntity
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
