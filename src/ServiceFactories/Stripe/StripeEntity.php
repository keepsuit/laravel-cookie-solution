<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Stripe;

enum StripeEntity
{
    case USA;
    /** Contracting party for EEA, UK and Swiss customers. */
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Stripe, LLC',
            self::IRELAND => 'Stripe Payments Europe, Limited',
        };
    }
}
