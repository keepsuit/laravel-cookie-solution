<?php

use Keepsuit\CookieSolution\Facades\CookieSolution;
use Keepsuit\CookieSolution\Services\Google\GoogleAnalytics4;
use Keepsuit\CookieSolution\Services\Google\GoogleDataProcessingLocation;
use Keepsuit\CookieSolution\Services\Google\GoogleTagManager;
use Keepsuit\CookieSolution\Services\Meta\FacebookPixel;
use Keepsuit\CookieSolution\Services\Meta\MetaDataProcessingLocation;

it('generate base config for cookie solution', function () {
    $config = CookieSolution::getConfig();
    assert(is_array($config));

    expect($config)
        ->toMatchArray([
            'cookie_name' => 'laravel_cookie_solution',
            'cookie_lifetime' => 365,
            'texts' => [
                'tab_consent' => __('cookie-solution::banner.tab_consent'),
                'tab_customize' => __('cookie-solution::banner.tab_customize'),
                'tab_information' => __('cookie-solution::banner.tab_information'),
                'button_accept_all' => __('cookie-solution::banner.button_accept_all'),
                'button_accept_selected' => __('cookie-solution::banner.button_accept_selected'),
                'button_refuse' => __('cookie-solution::banner.button_refuse'),
                'button_customize' => __('cookie-solution::banner.button_customize'),
                'consent_title' => __('cookie-solution::banner.consent_title'),
                'consent_message' => __('cookie-solution::banner.consent_message'),
            ],
        ]);
});

it('generate config with configured services', function () {
    CookieSolution::register(new GoogleAnalytics4(GoogleDataProcessingLocation::IRELAND))
        ->register(new GoogleTagManager(GoogleDataProcessingLocation::IRELAND))
        ->register(new FacebookPixel(MetaDataProcessingLocation::IRELAND));

    $config = CookieSolution::getConfig();

    expect($config)
        ->toHaveKey('cookies');

    expect($config['cookies'])
        ->toMatchArray([
            'statistics' => [
                [
                    'provider' => 'Google Ireland Limited',
                    'cookies' => [
                        ['name' => '_ga', 'description' => 'Used to distinguish users.', 'duration' => 730],
                        ['name' => '_ga_*', 'description' => 'Used to maintain session status.', 'duration' => 730],
                    ],
                ],
            ],
            'marketing' => [
                [
                    'provider' => 'Meta Platforms Ireland Limited',
                    'cookies' => [
                        ['name' => '_fbp', 'description' => 'Used to store and track visits across websites.', 'duration' => 90],
                        ['name' => 'fr', 'description' => 'Used to provide ad delivery or retargeting.', 'duration' => 90],
                    ],
                ],
            ],
        ]);
});
