<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PayPal;

enum PayPalEntity
{
    case USA;
    /** EEA customers. */
    case LUXEMBOURG;
    case UNITED_KINGDOM;
    /** Swiss customers. */
    case SINGAPORE;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'PayPal, Inc.',
            self::LUXEMBOURG => 'PayPal (Europe) S.à r.l. et Cie, S.C.A.',
            self::UNITED_KINGDOM => 'PayPal UK Ltd',
            self::SINGAPORE => 'PayPal Pte. Ltd.',
        };
    }
}
