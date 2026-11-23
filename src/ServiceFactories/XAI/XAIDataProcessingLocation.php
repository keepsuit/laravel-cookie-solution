<?php

namespace Keepsuit\CookieSolution\ServiceFactories\XAI;

use Keepsuit\CookieSolution\DataProcessingArea;
use Symfony\Component\Intl\Countries;

enum XAIDataProcessingLocation
{
    case WORLDWIDE;
    /** `us.api.x.ai` */
    case USA;

    public function country(): string
    {
        return match ($this) {
            self::WORLDWIDE => DataProcessingArea::WORLDWIDE->label(),
            self::USA => Countries::getName('US', app()->getLocale()),
        };
    }
}
