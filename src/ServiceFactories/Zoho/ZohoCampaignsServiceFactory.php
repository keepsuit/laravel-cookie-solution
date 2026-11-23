<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Zoho;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class ZohoCampaignsServiceFactory extends ServiceFactory
{
    protected ?ZohoEntity $entity = null;

    protected ZohoDataProcessingLocation $location = ZohoDataProcessingLocation::USA;

    /**
     * Sets the contracting entity, which follows the customer's country and not the data center.
     */
    public function entity(ZohoEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    public function location(ZohoDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Zoho Campaigns',
            provider: $this->entity?->provider() ?? $this->location->provider(),
            description: __('cookie-solution::services.zoho_campaigns.description'),
            privacyPolicyUrl: 'https://www.zoho.com/privacy.html',
            dataProcessingLocation: $this->location->country(),
        );
    }
}
