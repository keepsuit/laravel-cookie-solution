<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class GoogleTagManagerServiceFactory extends ServiceFactory
{
    protected GoogleDataProcessingLocation $location = GoogleDataProcessingLocation::USA;

    public function location(GoogleDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Google Tag Manager',
            provider: $this->location->provider(),
        );
    }
}
