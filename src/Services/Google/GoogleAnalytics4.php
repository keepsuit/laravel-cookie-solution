<?php

namespace Keepsuit\CookieSolution\Services\Google;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\Service;

class GoogleAnalytics4 implements Service
{
    public function __construct(
        public readonly GoogleDataProcessingLocation $location,
        protected readonly int $cookieDurationInDays = 730,
    ) {
    }

    public function provider(): string
    {
        return $this->location->provider();
    }

    public function name(): string
    {
        return 'Google Analytics 4';
    }

    public function cookies(): array
    {
        return [
            new Cookie(
                name: '_ga',
                purpose: CookiePurpose::STATISTICS,
                duration: $this->cookieDurationInDays,
                description: __('cookie-solution::services.google_analytics_4.cookies._ga'),
            ),
            new Cookie(
                name: '_ga_*',
                purpose: CookiePurpose::STATISTICS,
                duration: $this->cookieDurationInDays,
                description: __('cookie-solution::services.google_analytics_4.cookies._ga_*')
            ),
        ];
    }
}
