<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Klarna;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;
use Symfony\Component\Intl\Countries;

class KlarnaServiceFactory extends ServiceFactory
{
    public function build(): Service
    {
        return new Service(
            name: 'Klarna',
            provider: 'Klarna Bank AB',
            description: __('cookie-solution::services.klarna.description'),
            privacyPolicyUrl: 'https://www.klarna.com/international/privacy-policy/',
            dataProcessingLocation: Countries::getName('SE'),
        );
    }
}
