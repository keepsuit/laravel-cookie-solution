<?php

namespace Keepsuit\CookieSolution\ServiceFactories\Vimeo;

use Keepsuit\CookieSolution\Cookie;
use Keepsuit\CookieSolution\CookiePurpose;
use Keepsuit\CookieSolution\Service;
use Keepsuit\CookieSolution\ServiceFactories\ServiceFactory;
use Symfony\Component\Intl\Countries;

/**
 * Embedded Vimeo player. Its iframe should wait for `statistics`; with `doNotTrack()` (player URLs with `dnt=1`)
 * Vimeo sets only the cookies that secure the player.
 */
class VimeoServiceFactory extends ServiceFactory
{
    protected bool $doNotTrack = false;

    public function doNotTrack(bool $doNotTrack = true): static
    {
        $this->doNotTrack = $doNotTrack;

        return $this;
    }

    public function build(): Service
    {
        $cookies = [
            'player_clearance' => [CookiePurpose::NECESSARY, 7],
            'cf_clearance' => [CookiePurpose::NECESSARY, 365],
            // Actually 30 minutes: durations are whole days, so round up.
            '__cf_bm' => [CookiePurpose::NECESSARY, 1],
            '_cfuvid' => [CookiePurpose::NECESSARY, 0],
        ];

        if (! $this->doNotTrack) {
            $cookies += [
                'vuid' => [CookiePurpose::STATISTICS, 730],
                'player' => [CookiePurpose::STATISTICS, 365],
                'flags' => [CookiePurpose::STATISTICS, 365],
            ];
        }

        return new Service(
            name: 'Vimeo',
            provider: 'Vimeo.com, Inc.',
            description: __('cookie-solution::services.vimeo.description'),
            privacyPolicyUrl: 'https://vimeo.com/privacy',
            dataProcessingLocation: Countries::getName('US', app()->getLocale()),
            cookies: array_map(
                fn (string $name, array $cookie) => new Cookie(
                    name: $name,
                    purpose: $cookie[0],
                    duration: $cookie[1],
                    description: __('cookie-solution::services.vimeo.cookies.'.$name),
                ),
                array_keys($cookies),
                $cookies,
            ),
        );
    }
}
