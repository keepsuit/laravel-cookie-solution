<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Mailchimp;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;
use Symfony\Component\Intl\Countries;

class MailchimpServiceFactory extends ServiceFactory
{
    public function build(): Service
    {
        return new Service(
            name: 'Mailchimp',
            provider: 'Intuit Inc.',
            description: __('cookie-solution::services.mailchimp.description') ?? '',
            privacyPolicyUrl: 'https://www.intuit.com/privacy/statement/',
            dataProcessingLocation: Countries::getName('US', app()->getLocale()),
        );
    }
}
