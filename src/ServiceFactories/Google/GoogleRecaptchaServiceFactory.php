<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

/**
 * Google reCAPTCHA. Google classifies `_GRECAPTCHA` as necessary and, since April 2026, processes the data only to provide
 * the service.
 */
class GoogleRecaptchaServiceFactory extends ServiceFactory
{
    protected GoogleDataProcessingLocation $location = GoogleDataProcessingLocation::USA;

    public function location(GoogleDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Google reCAPTCHA',
            provider: $this->location->provider(),
            description: __('cookie-solution::services.google_recaptcha.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: $this->location->country(),
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
