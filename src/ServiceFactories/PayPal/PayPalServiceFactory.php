<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PayPal;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class PayPalServiceFactory extends ServiceFactory
{
    public function build(): Service
    {
        return new Service(
            name: 'PayPal',
            provider: 'PayPal Inc.',
            description: __('cookie-solution::services.paypal.description'),
            privacyPolicyUrl: 'https://www.paypal.com/webapps/mpp/ua/privacy-full',
        );
    }
}
