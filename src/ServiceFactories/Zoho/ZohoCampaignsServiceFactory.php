<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Zoho;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class ZohoCampaignsServiceFactory extends ServiceFactory
{
    protected ZohoDataProcessingLocation $location = ZohoDataProcessingLocation::USA;

    public function location(ZohoDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Zoho Campaigns',
            provider: 'Zoho Corporation Pvt. Ltd.',
            description: __('cookie-solution::services.zoho_campaigns.description') ?? '',
            privacyPolicyUrl: 'https://www.intuit.com/privacy/statement/',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
