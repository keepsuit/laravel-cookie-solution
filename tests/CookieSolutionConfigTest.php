<?php

use Keepsuit\CookieSolution\Facades\CookieSolution;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleAnalytics4ServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleDataProcessingLocation;
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleTagManagerServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Meta\FacebookPixelServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Meta\MetaDataProcessingLocation;

it('generate base config for cookie solution', function () {
    $config = CookieSolution::getConfig();
    assert(is_array($config));

    expect($config)
        ->toMatchArray([
            'cookie_name' => 'laravel_cookie_solution',
            'cookie_lifetime' => 365,
            'texts' => [
                'tab_consent' => 'Consent',
                'tab_customize' => 'Customize',
                'tab_information' => 'Information',
                'button_accept_all' => 'Accept all',
                'button_accept_selected' => 'Accetta selected',
                'button_refuse' => 'Refuse',
                'button_customize' => 'Customize',
                'consent_title' => 'This site uses cookies',
                'consent_message' => 'We use cookies to customize content and ads, to provide social media features and to analyze our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you\'ve provided to them or that they\'ve collected from your use of their services.',
                'customize_purpose_necessary' => 'Necessary',
                'customize_purpose_necessary_description' => 'These cookies are necessary for the website to enable functionality (such as access to personal area or store your shopping cart). The website cannot function properly without these cookies.',
                'customize_purpose_preferences' => 'Preferences',
                'customize_purpose_preferences_description' => 'These cookies allow the website to remember choices you make (such as your preferred language or your location) and provide enhanced, more personal features.',
                'customize_purpose_statistics' => 'Statistics',
                'customize_purpose_statistics_description' => 'These cookies collect information about how visitors use the website (such as which pages visitors go to most often). The collected information are aggregated and anonymous.',
                'customize_purpose_marketing' => 'Marketing',
                'customize_purpose_marketing_description' => 'These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign. They allow publishers and third party advertisers to target ads to you and your interests.',
                'information_text' => \Illuminate\Support\Str::markdown(file_get_contents(__DIR__.'/../resources/views/policy/cookie-policy.en.md')),
            ],
        ]);
});

it('generate config with configured services', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
        ->register(GoogleTagManagerServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
        ->register(FacebookPixelServiceFactory::new()->location(MetaDataProcessingLocation::IRELAND)->build());

    $config = CookieSolution::getConfig();

    expect($config)
        ->toHaveKey('cookies');

    expect($config['cookies'])
        ->toMatchArray([
            'statistics' => [
                [
                    'name' => 'Google Analytics 4',
                    'provider' => 'Google Ireland Limited',
                    'privacy_policy_url' => 'https://policies.google.com/privacy',
                    'data_processing_location' => 'Ireland',
                    'description' => 'Google Analytics is a statistics service and uses cookies to collect data on website visitors. The data collected by Google Analytics is anonymous and does not include personal information. Google may use the data collected to contextualize and personalize the ads of its advertising network. You can get more information about Google Analytics and how to opt out of data collection by visiting the Google Analytics website.',
                    'cookies' => [
                        ['name' => '_ga', 'description' => 'Used to distinguish users.', 'duration' => 730, 'purpose' => 'statistics'],
                        ['name' => '_ga_*', 'description' => 'Used to maintain session status.', 'duration' => 730, 'purpose' => 'statistics'],
                    ],
                ],
            ],
            'marketing' => [
                [
                    'provider' => 'Meta Platforms Ireland Limited',
                    'name' => 'Facebook Pixel',
                    'privacy_policy_url' => 'https://www.facebook.com/privacy/explanation',
                    'data_processing_location' => 'Ireland',
                    'description' => 'Facebook Pixel uses cookies to collect data about website visitors. The data collected by Facebook Pixel is anonymous and does not include personal information. Facebook may use the collected data to target ads to website visitors and to understand the effectiveness of Facebook advertising campaigns. You can learn more about Facebook Pixel and how to opt out of data collection by visiting the Facebook website.',
                    'cookies' => [
                        ['name' => '_fbp', 'description' => 'Used to store and track visits across websites.', 'duration' => 90, 'purpose' => 'marketing'],
                        ['name' => 'fr', 'description' => 'Used to provide ad delivery or retargeting.', 'duration' => 90, 'purpose' => 'marketing'],
                    ],
                ],
            ],
        ]);
});

it('generate config digest to invalidate consent on change', function () {
    CookieSolution::register(GoogleAnalytics4ServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
        ->register(GoogleTagManagerServiceFactory::new()->location(GoogleDataProcessingLocation::IRELAND)->build())
        ->register(FacebookPixelServiceFactory::new()->location(MetaDataProcessingLocation::IRELAND)->build());

    $config = CookieSolution::getConfig();

    expect($config)
        ->toHaveKey('digest');

    expect($config['digest'])
        ->toBe(CookieSolution::getConfig()['digest']);
});
