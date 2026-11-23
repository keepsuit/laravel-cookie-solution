<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Microsoft;

enum MicrosoftEntity
{
    case USA;
    /** Licensor for EMEA customers. */
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Microsoft Corporation',
            self::IRELAND => 'Microsoft Ireland Operations Limited',
        };
    }
}
