<?php

namespace Keepsuit\CookieSolution\ServiceFactories\OpenAI;

use Keepsuit\CookieSolution\DataProcessingArea;

enum OpenAIDataProcessingLocation
{
    case WORLDWIDE;
    /** Projects with European data residency (`eu.api.openai.com`). */
    case EUROPE;

    public function country(): string
    {
        return match ($this) {
            self::WORLDWIDE => DataProcessingArea::WORLDWIDE->label(),
            self::EUROPE => DataProcessingArea::EUROPE->label(),
        };
    }
}
