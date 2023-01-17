<?php

namespace Keepsuit\CookieSolution\Services\Google;

enum GoogleDataProcessingLocation
{
    case USA;
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Google LLC',
            self::IRELAND => 'Google Ireland Limited',
        };
    }
}
