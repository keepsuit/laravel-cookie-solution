<?php

namespace Keepsuit\CookieSolution\ServiceFactories\OpenRouter;

use Keepsuit\CookieSolution\DataProcessingArea;

enum OpenRouterDataProcessingLocation
{
    case WORLDWIDE;
    /** EU in-region routing (`eu.openrouter.ai`). */
    case EUROPE;

    public function country(): string
    {
        return match ($this) {
            self::WORLDWIDE => DataProcessingArea::WORLDWIDE->label(),
            self::EUROPE => DataProcessingArea::EUROPE->label(),
        };
    }
}
