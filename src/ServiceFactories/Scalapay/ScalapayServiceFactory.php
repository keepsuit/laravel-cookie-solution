<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Scalapay;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;
use Symfony\Component\Intl\Countries;

class ScalapayServiceFactory extends ServiceFactory
{
    public function build(): Service
    {
        return new Service(
            name: 'Scalapay',
            provider: 'Scalapay IP S.p.A.',
            description: __('cookie-solution::services.scalapay.description'),
            privacyPolicyUrl: 'https://paymentinstitute.scalapay.com/policy',
            dataProcessingLocation: Countries::getName('IT', app()->getLocale()),
        );
    }
}
