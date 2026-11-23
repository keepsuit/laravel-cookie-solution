<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Meta;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

class FacebookPixelServiceFactory extends ServiceFactory
{
    protected MetaEntity $entity = MetaEntity::USA;

    public function entity(MetaEntity $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    /** @deprecated Use entity(): the data is processed worldwide, this only selects the entity. */
    public function location(MetaDataProcessingLocation $location): static
    {
        $this->entity = $location->entity();

        return $this;
    }

    public function build(): Service
    {
        return new Service(
            name: 'Meta Pixel',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.facebook_pixel.description'),
            privacyPolicyUrl: 'https://www.facebook.com/privacy/policy/',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
            cookies: [
                new Cookie(
                    name: '_fbp',
                    purpose: CookiePurpose::MARKETING,
                    duration: 3 * 30,
                    description: __('cookie-solution::services.facebook_pixel.cookies._fbp'),
                ),
                new Cookie(
                    name: '_fbc',
                    purpose: CookiePurpose::MARKETING,
                    duration: 3 * 30,
                    description: __('cookie-solution::services.facebook_pixel.cookies._fbc'),
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
