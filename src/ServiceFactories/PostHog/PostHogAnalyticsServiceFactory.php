<?php

namespace Keepsuit\CookieSolution\ServiceFactories\PostHog;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class PostHogAnalyticsServiceFactory extends ServiceFactory
{
    protected PostHogDataProcessingLocation $location = PostHogDataProcessingLocation::USA;

    protected int $cookieDurationInDays = 365;

    public function location(PostHogDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function cookieDuration(int $days): static
    {
        $this->cookieDurationInDays = $days;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'PostHog Analytics',
            provider: $this->location->provider(),
            description: __('cookie-solution::services.posthog_analytics.description'),
            privacyPolicyUrl: 'https://posthog.com/privacy',
            dataProcessingLocation: $this->location->country(),
            cookies: [
                new Cookie(
                    name: 'ph_phc_*',
                    purpose: CookiePurpose::STATISTICS,
                    duration: $this->cookieDurationInDays,
                    description: __('cookie-solution::services.posthog_analytics.cookies.ph_phc_*'),
                ),
            ]
        );
    }
}
