<?php

return [
    'google_analytics_4' => [
        'description' => 'Google Analytics is a statistics service and uses cookies to collect data on website visitors. The data collected by Google Analytics is anonymous and does not include personal information. Google may use the data collected to contextualize and personalize the ads of its advertising network. You can get more information about Google Analytics and how to opt out of data collection by visiting the Google Analytics website.',
        'cookies' => [
            '_ga' => 'Used to distinguish users.',
            '_ga_*' => 'Used to maintain session status.',
        ],
    ],
    'google_tag_manager' => [
        'description' => 'Google Tag Manager is a service that allows to add and manage various marketing and analytics tags through a single interface. Google Tag Manager does not collect any personal information, but it may pass data to other services such as Google Analytics, Adwords, and others. You can learn more about Google Tag Manager and its data practices by visiting the Google Tag Manager website.',
    ],
    'facebook_pixel' => [
        'description' => 'Facebook Pixel uses cookies to collect data about website visitors. The data collected by Facebook Pixel is anonymous and does not include personal information. Facebook may use the collected data to target ads to website visitors and to understand the effectiveness of Facebook advertising campaigns. You can learn more about Facebook Pixel and how to opt out of data collection by visiting the Facebook website.',
        'cookies' => [
            '_fbp' => 'Used to store and track visits across websites.',
            'fr' => 'Used to provide ad delivery or retargeting.',
        ],
    ],
    'amazon_web_services' => [
        'description' => 'Amazon Web Services (AWS) is hosting service that allows us to store and process data in a secure and reliable manner. Data stored on AWS may include personal information such as names, email addresses, and browsing data. Amazon may use the data in accordance with its own privacy policy, which can be found on the Amazon Web Services website. We take reasonable steps to ensure that data stored on AWS is protected and secure, but we cannot guarantee the absolute security of data stored on third-party servers.',
    ],
];
