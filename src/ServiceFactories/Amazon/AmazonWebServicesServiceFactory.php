<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Amazon;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class AmazonWebServicesServiceFactory extends ServiceFactory
{
    protected AmazonWebServicesLocation $location = AmazonWebServicesLocation::UNITED_STATES;

    public function location(AmazonWebServicesLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Amazon Web Services',
            provider: 'Amazon Web Services, Inc.',
            description: __('cookie-solution::services.amazon_web_services.description') ?? '',
            privacyPolicyUrl: 'https://aws.amazon.com/compliance/data-privacy-faq/'
        );
    }
}
