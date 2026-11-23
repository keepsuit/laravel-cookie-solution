<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Anthropic;

use Keepsuit\CookieSolution\DataProcessingArea;
use Symfony\Component\Intl\Countries;

enum AnthropicDataProcessingLocation
{
    case WORLDWIDE;
    /** Workspaces with the `us` inference geography. */
    case USA;

    public function country(): string
    {
        return match ($this) {
            self::WORLDWIDE => DataProcessingArea::WORLDWIDE->label(),
            self::USA => Countries::getName('US', app()->getLocale()),
        };
    }
}
