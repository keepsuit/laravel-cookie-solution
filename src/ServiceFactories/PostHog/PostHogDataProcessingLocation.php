<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PostHog;

use Symfony\Component\Intl\Countries;

enum PostHogDataProcessingLocation
{
    case USA;
    case EUROPE;

    public function provider(): string
    {
        return 'PostHog Inc.';
    }

    public function country(): string
    {
        return match ($this) {
            self::USA => Countries::getName('US', app()->getLocale()),
            self::EUROPE => Countries::getName('DE', app()->getLocale())
        };
    }
}
