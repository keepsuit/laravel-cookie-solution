<?php

namespace Keepsuit\CookieSolution\Services\Meta;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\Service;

class FacebookPixel implements Service
{
    public function __construct(
        public readonly MetaDataProcessingLocation $location
    ) {
    }

    public function provider(): string
    {
        return $this->location->provider();
    }

    public function cookies(): array
    {
        return [
            new Cookie(
                name: '_fbp',
                purpose: CookiePurpose::MARKETING,
                duration: 3 * 30,
                description: __('cookiesolution::services.facebook_pixel.cookies._fbp'),
            ),
            new Cookie(
                name: 'fr',
                purpose: CookiePurpose::MARKETING,
                duration: 3 * 30,
                description: __('cookiesolution::services.facebook_pixel.cookies.fr'),
            ),
        ];
    }
}
