<?php

namespace Keepsuit\CookieSolution\Services\Meta;

enum MetaDataProcessingLocation
{
    case USA;
    case IRELAND;

    public function provider(): string
    {
        return match ($this) {
            self::USA => 'Meta Platforms, Inc.',
            self::IRELAND => 'Meta Platforms Ireland Limited',
        };
    }
}
