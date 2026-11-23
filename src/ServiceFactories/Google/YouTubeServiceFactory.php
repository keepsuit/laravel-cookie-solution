<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Google;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\DataProcessingArea;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;

/**
 * Embedded YouTube player. Its iframe should wait for `marketing`: Google uses `__Secure-YNID` and `VISITOR_INFO1_LIVE` for advertising.
 */
class YouTubeServiceFactory extends ServiceFactory
{
    protected GoogleEntity $entity = GoogleEntity::USA;

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

    public function build(): Service
    {
        $cookies = [
            'YSC' => [CookiePurpose::NECESSARY, 0],
            '__Secure-YEC' => [CookiePurpose::NECESSARY, 390],
            'PREF' => [CookiePurpose::PREFERENCES, 240],
            '__Secure-ROLLOUT_TOKEN' => [CookiePurpose::STATISTICS, 180],
            '__Secure-YNID' => [CookiePurpose::MARKETING, 180],
            'VISITOR_INFO1_LIVE' => [CookiePurpose::MARKETING, 180],
        ];

        return new Service(
            name: 'YouTube',
            provider: $this->entity->provider(),
            description: __('cookie-solution::services.youtube.description'),
            privacyPolicyUrl: 'https://policies.google.com/privacy',
            dataProcessingLocation: DataProcessingArea::WORLDWIDE->label(),
            cookies: array_map(
                fn (string $name, array $cookie) => new Cookie(
                    name: $name,
                    purpose: $cookie[0],
                    duration: $cookie[1],
                    description: __('cookie-solution::services.youtube.cookies.'.$name),
                ),
                array_keys($cookies),
                $cookies,
            ),
        );
    }
}
