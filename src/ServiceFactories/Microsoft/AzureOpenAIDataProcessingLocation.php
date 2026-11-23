<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Microsoft;

use Keepsuit\CookieSolution\DataProcessingArea;
use Symfony\Component\Intl\Countries;

/**
 * Deployment type: Global, or a Data Zone.
 */
enum AzureOpenAIDataProcessingLocation
{
    case WORLDWIDE;
    case EUROPE;
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
