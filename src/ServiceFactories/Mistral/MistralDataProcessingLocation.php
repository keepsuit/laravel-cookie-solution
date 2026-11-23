<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Mistral;

use Keepsuit\CookieSolution\DataProcessingArea;
use Symfony\Component\Intl\Countries;

enum MistralDataProcessingLocation
{
    // The help center says data is hosted in the EEA by default; the API docs call the default endpoint not region-specific.
    case EUROPE;
    /** `api.us.mistral.ai` */
    case USA;

    public function country(): string
    {
        return match ($this) {
            self::EUROPE => DataProcessingArea::EUROPE->label(),
            self::USA => Countries::getName('US', app()->getLocale()),
        };
    }
}
