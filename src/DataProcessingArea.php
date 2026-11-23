<?php

namespace Keepsuit\CookieSolution;

/**
 * Data processing locations that are not a single country.
 */
enum DataProcessingArea: string
{
    case EUROPE = 'europe';
    case WORLDWIDE = 'worldwide';

    public function label(): string
    {
        return __('cookie-solution::texts.data_processing_areas.'.$this->value);
    }
}
