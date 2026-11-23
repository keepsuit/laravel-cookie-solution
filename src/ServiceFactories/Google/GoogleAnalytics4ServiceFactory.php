<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class GoogleAnalytics4ServiceFactory extends ServiceFactory
{
    protected GoogleEntity $entity = GoogleEntity::USA;

    protected int $cookieDurationInDays = 730;

    public function entity(GoogleEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(): the data is processed worldwide, this only selects the entity. */
    public function location(GoogleDataProcessingLocation $location): static
    {
        $this->entity = $location->entity();

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
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.google_analytics_4.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
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
