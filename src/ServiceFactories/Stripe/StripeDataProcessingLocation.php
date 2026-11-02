<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Stripe;

use Symfony\Component\Intl\Countries;

enum StripeDataProcessingLocation
{
    case USA;
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Stripe Inc.',
            self::IRELAND => 'Stripe Technology Europe, Limited',
        };
    }

    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::IRELAND => Countries::getName('IE', app()->getLocale()),
        };
    }
}
