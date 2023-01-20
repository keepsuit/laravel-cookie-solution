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
                'customize_purpose_necessary' => __('cookie-solution::banner.customize_purpose_necessary'),
                'customize_purpose_necessary_description' => __('cookie-solution::banner.customize_purpose_necessary_description'),
                'customize_purpose_preferences' => __('cookie-solution::banner.customize_purpose_preferences'),
                'customize_purpose_preferences_description' => __('cookie-solution::banner.customize_purpose_preferences_description'),
                'customize_purpose_statistics' => __('cookie-solution::banner.customize_purpose_statistics'),
                'customize_purpose_statistics_description' => __('cookie-solution::banner.customize_purpose_statistics_description'),
                'customize_purpose_marketing' => __('cookie-solution::banner.customize_purpose_marketing'),
                'customize_purpose_marketing_description' => __('cookie-solution::banner.customize_purpose_marketing_description'),
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
                    'name' => 'Google Analytics 4',
                    'cookies' => [
                        ['name' => '_ga', 'description' => 'Used to distinguish users.', 'duration' => 730],
                        ['name' => '_ga_*', 'description' => 'Used to maintain session status.', 'duration' => 730],
                    ],
                ],
            ],
            'marketing' => [
                [
                    'provider' => 'Meta Platforms Ireland Limited',
                    'name' => 'Facebook Pixel',
                    'cookies' => [
                        ['name' => '_fbp', 'description' => 'Used to store and track visits across websites.', 'duration' => 90],
                        ['name' => 'fr', 'description' => 'Used to provide ad delivery or retargeting.', 'duration' => 90],
                    ],
                ],
            ],
        ]);
});

it('outputs script', function () {
    $script = CookieSolution::script();

    expect($script)
        ->toBeInstanceOf(\Illuminate\Support\HtmlString::class);

    expect($script->toHtml())
        ->toContain(
            'window._cookieSolution = {',
            '<script type="module" src="/cookie-solution/laravel-cookie-solution.js?id='
        );
});
