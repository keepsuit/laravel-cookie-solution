<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Scalapay;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class ScalapayServiceFactory extends ServiceFactory
{
    public function build(): Service
    {
        return new Service(
            name: 'Scalapay',
            provider: 'Scalapay s.r.l.',
            description: __('cookie-solution::services.scalapay.description'),
            privacyPolicyUrl: 'https://www.scalapay.com/privacy',
        );
    }
}
