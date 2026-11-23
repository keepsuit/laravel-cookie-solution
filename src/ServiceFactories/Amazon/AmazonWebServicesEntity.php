<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Amazon;

enum AmazonWebServicesEntity
{
    case USA;
    /** Contracting party for EMEA customers. */
    case LUXEMBOURG;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Amazon Web Services, Inc.',
            self::LUXEMBOURG => 'Amazon Web Services EMEA SARL',
        };
    }
}
