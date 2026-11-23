<?php

namespace Keepsuit\CookieSolution\ServiceFactories\OpenRouter;

use Keepsuit\CookieSolution\DataProcessingArea;
use Symfony\Component\Intl\Countries;

enum OpenRouterDataProcessingLocation
{
    case WORLDWIDE;
    /** EU in-region routing (`eu.openrouter.ai`). */
    case EUROPE;
    /** US in-region routing (`us.openrouter.ai`). */
    case USA;

    public function country(): string
    {
        return match ($this) {
            self::WORLDWIDE => DataProcessingArea::WORLDWIDE->label(),
            self::EUROPE => DataProcessingArea::EUROPE->label(),
            self::USA => Countries::getName('US', app()->getLocale()),
        };
    }
}
