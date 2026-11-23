<?php

namespace Keepsuit\CookieSolution\ServiceFactories\TypeSafe;

use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;
use Symfony\Component\Intl\Countries;

class TypeSafeServiceFactory extends ServiceFactory
{
    public function build(): Service
    {
        return new Service(
            name: 'TypeSafe',
            provider: 'TypeSafe AI, Inc.',
            description: __('cookie-solution::services.typesafe.description'),
            privacyPolicyUrl: 'https://typesafe.ai/privacy',
            dataProcessingLocation: Countries::getName('US', app()->getLocale()),
        );
    }
}
