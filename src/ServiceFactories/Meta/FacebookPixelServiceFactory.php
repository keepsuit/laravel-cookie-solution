<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Meta;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class FacebookPixelServiceFactory extends ServiceFactory
{
    protected MetaDataProcessingLocation $location = MetaDataProcessingLocation::USA;

    public function location(MetaDataProcessingLocation $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Facebook Pixel',
            provider: $this->location->provider(),
            privacyPolicyUrl: 'https://www.facebook.com/privacy/explanation',
            cookies: [
                new Cookie(
                    name: '_fbp',
                    purpose: CookiePurpose::MARKETING,
                    duration: 3 * 30,
                    description: __('cookie-solution::services.facebook_pixel.cookies._fbp'),
                ),
                new Cookie(
                    name: 'fr',
                    purpose: CookiePurpose::MARKETING,
                    duration: 3 * 30,
                    description: __('cookie-solution::services.facebook_pixel.cookies.fr'),
                ),
            ]
        );
    }
}
