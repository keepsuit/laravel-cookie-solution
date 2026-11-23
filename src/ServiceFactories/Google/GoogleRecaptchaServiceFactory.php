<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

/**
 * Google reCAPTCHA. Google classifies `_GRECAPTCHA` as necessary and, since April 2026, processes the data only to provide
 * the service.
 */
class GoogleRecaptchaServiceFactory extends ServiceFactory
{
    protected GoogleCloudEntity $entity = GoogleCloudEntity::USA;

    public function entity(GoogleCloudEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(): the data is processed worldwide, this only selects the entity. */
    public function location(GoogleDataProcessingLocation $location): static
    {
        $this->entity = match ($location) {
            GoogleDataProcessingLocation::USA => GoogleCloudEntity::USA,
            GoogleDataProcessingLocation::IRELAND => GoogleCloudEntity::EMEA,
        };

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Google reCAPTCHA',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.google_recaptcha.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
            cookies: [
                new Cookie(
                    name: '_GRECAPTCHA',
                    purpose: CookiePurpose::NECESSARY,
                    // Not published by Google: 6 months as reported by cookie scanners.
                    duration: 180,
                    description: __('cookie-solution::services.google_recaptcha.cookies._GRECAPTCHA'),
                ),
            ],
        );
    }
}
