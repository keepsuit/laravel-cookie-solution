<?php

namespace Keepsuit\CookieSolution\Services\Google;

use Keepsuit\CookieSolution\Service;

class GoogleTagManager implements Service
{
    public function __construct(
        public readonly GoogleDataProcessingLocation $location,
    ) {
    }

    public function provider(): string
    {
        return $this->location->provider();
    }

    public function cookies(): array
    {
        return [];
    }
}
