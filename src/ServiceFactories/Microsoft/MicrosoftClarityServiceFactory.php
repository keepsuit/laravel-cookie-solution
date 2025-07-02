<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Microsoft;

use Illuminate\Support\Collection;
use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class MicrosoftClarityServiceFactory extends ServiceFactory
{
    public function build(): Service
    {
        $cookies = Collection::make([
            '_clck' => 365,
            '_clsk' => 1,
            'CLID' => 365,
        ])->map(function (int $duration, string $name) {
            return new Cookie(
                name: $name,
                purpose: CookiePurpose::STATISTICS,
                duration: $duration,
                description: __('cookie-solution::services.microsoft_clarity.cookies.'.$name),
            );
        })->all();

        return new Service(
            name: 'Microsoft Clarity',
            provider: 'Microsoft',
            description: __('cookie-solution::services.microsoft_clarity.description'),
            privacyPolicyUrl: 'https://www.microsoft.com/privacy/privacystatement',
            cookies: $cookies
        );
    }
}
