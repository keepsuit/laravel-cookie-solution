<?php

namespace Keepsuit\CookieSolution\ServiceFactories\DigitalOcean;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class DigitalOceanServiceFactory extends ServiceFactory
{
    protected DigitalOceanLocation $location = DigitalOceanLocation::USA;

    public function location(DigitalOceanLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'DigitalOcean',
            provider: 'DigitalOcean Inc.',
            description: __('cookie-solution::services.digital_ocean.description') ?? '',
            privacyPolicyUrl: 'https://www.digitalocean.com/legal/privacy-policy/',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
