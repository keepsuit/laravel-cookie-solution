<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class GoogleAnalytics4ServiceFactory extends ServiceFactory
{
    protected ?GoogleEntity $entity = null;

    protected GoogleDataProcessingLocation $location = GoogleDataProcessingLocation::USA;

    protected int $cookieDurationInDays = 730;

    /**
     * Sets the contracting entity and shows the data processing location as worldwide.
     */
    public function entity(GoogleEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(). */
    public function location(GoogleDataProcessingLocation $location): static
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
            name: 'Google Analytics 4',
            provider: $this->entity?->provider() ?? $this->location->provider(),
            description: __('cookie-solution::services.google_analytics_4.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: $this->entity ? DataProcessingArea::WORLDWIDE->label() : $this->location->country(),
            cookies: [
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
            ]
        );
    }
}
