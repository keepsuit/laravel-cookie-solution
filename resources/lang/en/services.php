<?php

return [
    'amazon_web_services' => [
        'description' => 'Amazon Web Services (AWS) is hosting service that allows us to store and process data in a secure and reliable manner. Data stored on AWS may include personal information such as names, email addresses, and browsing data. Amazon may use the data in accordance with its own privacy policy, which can be found on the Amazon Web Services website. We take reasonable steps to ensure that data stored on AWS is protected and secure, but we cannot guarantee the absolute security of data stored on third-party servers.',
    ],
    'digital_ocean' => [
        'description' => 'DigitalOcean is a hosting service that allows us to store and process data in a secure and reliable manner. Data stored on DigitalOcean may include personal information such as names, email addresses, and browsing data. DigitalOcean may use the data in accordance with its own privacy policy, which can be found on the DigitalOcean website.',
    ],
    'facebook_pixel' => [
        'description' => 'Facebook Pixel uses cookies to collect data about website visitors. The data collected by Facebook Pixel is anonymous and does not include personal information. Facebook may use the collected data to target ads to website visitors and to understand the effectiveness of Facebook advertising campaigns. You can learn more about Facebook Pixel and how to opt out of data collection by visiting the Facebook website.',
        'cookies' => [
            '_fbp' => 'Used to store and track visits across websites.',
            'fr' => 'Used to provide ad delivery or retargeting.',
        ],
    ],
    'google_ads_remarketing' => [
        'description' => 'Google Ads Remarketing is a service that allows us to show ads to users who have previously visited our website. Google Ads Remarketing uses cookies to collect data about website visitors. The data collected by Google Ads Remarketing is anonymous and does not include personal information. Google may use the collected data to target ads to website visitors and to understand the effectiveness of Google advertising campaigns. You can learn more about Google Ads Remarketing and how to opt out of data collection by visiting the Google Ads website.',
        'cookies' => [
            '_generic' => 'Used to provide ad delivery or retargeting',
            'NID' => 'Used to provide ad delivery or retargeting and store user preferences',
            'CONSENT' => 'Used to store consent preferences',
            'HSID' => 'Used to provide fraud prevention',
            'SID' => 'Used to provide ad delivery or retargeting and provide fraud prevention',
            '_gac_*' => 'Used to store and track audience reach',
        ],
    ],
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
    'klarna' => [
        'description' => 'Klarna is a payment service that allows us to accept installment payments from our customers. Klarna may collect personal information such as names, email addresses, and billing information in order to evaluate the user\'s suitability for its payment methods and personalize those payment methods.',
    ],
    'mailchimp' => [
        'description' => 'Mailchimp is an email marketing service that allows us to send emails to our customers. Mailchimp may collect personal information such as names, email addresses, and browsing data.',
    ],
    'microsoft_clarity' => [
        'description' => 'Microsoft Clarity is an analysis service that allows us to collect data on the use of our website to improve its operation. Microsoft could collect information such as click, mouse movements, visited pages and other behavioral data.',
        'cookies' => [
            '_clck' => 'Persists the Clarity User ID and preferences, unique to that site is attributed to the same user ID.',
            '_clsk' => 'Connects multiple page views by a user into a single Clarity session recording.',
            'CLID' => 'Identifies the first-time Clarity saw this user on any site using Clarity.',
        ],
    ],
    'paypal' => [
        'description' => 'PayPal is a payment service that allows us to accept payments from our customers. PayPal may collect personal information such as names, email addresses, and billing information.',
    ],
    'posthog_analytics' => [
        'description' => 'PostHog analytics is a statistics service that allows us to collect data about the usage of our website to improve its functionality. PostHog may collect personal information such as names, email addresses, and browsing data.',
        'cookies' => [
            'ph_phc_*' => 'Used to obtain information about user behavior',
        ],
    ],
    'scalapay' => [
        'description' => 'Scalapay is a payment service that allows us to accept installment payments from our customers. Scalapay may collect personal information such as names, email addresses, and billing information in order to evaluate the user\'s suitability for its payment methods and personalize those payment methods.',
    ],
    'stripe' => [
        'description' => 'Stripe is a payment service that allows us to accept payments from our customers. Stripe may collect personal information such as names, email addresses, and billing information.',
    ],
    'zoho_campaigns' => [
        'description' => 'Zoho Campaigns is a marketing automation service that allows us to send emails to our customers. Zoho Campaigns may collect personal information such as names, email addresses, and browsing data.',
    ],
];
