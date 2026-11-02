<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PayPal;

use Symfony\Component\Intl\Countries;

enum PayPalDataProcessingLocation
{
    case USA;
    case LUXEMBOURG;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'PayPal Inc.',
            self::LUXEMBOURG => 'PayPal (Europe) S.a.r.l. et Cie, S.C.A.',
        };
    }

    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::LUXEMBOURG => Countries::getName('LU', app()->getLocale()),
        };
    }
}
