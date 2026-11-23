<?php

return [
    'amazon_bedrock' => [
        'description' => 'Amazon Bedrock is an artificial intelligence service that we use to provide some features of our website. The texts, files and other content sent to these features, which may include personal data, are transmitted to Amazon Bedrock for processing.',
    ],
    'amazon_web_services' => [
        'description' => 'Amazon Web Services (AWS) is hosting service that allows us to store and process data in a secure and reliable manner. Data stored on AWS may include personal information such as names, email addresses, and browsing data. Amazon may use the data in accordance with its own privacy policy, which can be found on the Amazon Web Services website. We take reasonable steps to ensure that data stored on AWS is protected and secure, but we cannot guarantee the absolute security of data stored on third-party servers.',
    ],
    'anthropic' => [
        'description' => 'Anthropic is an artificial intelligence service that we use to provide some features of our website. The texts, files and other content sent to these features, which may include personal data, are transmitted to Anthropic for processing.',
    ],
    'azure_ai' => [
        'description' => 'Azure AI is an artificial intelligence service that we use to provide some features of our website. The texts, files and other content sent to these features, which may include personal data, are transmitted to Azure AI for processing.',
    ],
    'cloudflare_ai_gateway' => [
        'description' => 'Cloudflare AI Gateway is a service that forwards requests to artificial intelligence providers. The texts, files and other content sent to the features of our website that use it, which may include personal data, pass through Cloudflare.',
    ],
    'digital_ocean' => [
        'description' => 'DigitalOcean is a hosting service that allows us to store and process data in a secure and reliable manner. Data stored on DigitalOcean may include personal information such as names, email addresses, and browsing data. DigitalOcean may use the data in accordance with its own privacy policy, which can be found on the DigitalOcean website.',
    ],
    'facebook_pixel' => [
        'description' => 'Meta Pixel uses cookies to collect data about website visitors. Meta may use the collected data to target ads to website visitors and to understand the effectiveness of Meta advertising campaigns. You can learn more about Meta Pixel and how to opt out of data collection by visiting the Meta website.',
        'cookies' => [
            '_fbp' => 'Used to store and track visits across websites.',
            '_fbc' => 'Used to store the ad click identifier to attribute conversions.',
            'fr' => 'Used to provide ad delivery or retargeting.',
        ],
    ],
    'google_ads_remarketing' => [
        'description' => 'Google Ads Remarketing is a service that allows us to show ads to users who have previously visited our website. Google Ads Remarketing uses cookies to collect data about website visitors. Google may use the collected data to target ads to website visitors and to understand the effectiveness of Google advertising campaigns. You can learn more about Google Ads Remarketing and how to opt out of data collection by visiting the Google Ads website.',
        'cookies' => [
            '_generic' => 'Used to provide ad delivery or retargeting',
            '_conversion' => 'Used to store ad click information and attribute conversions',
            'NID' => 'Used to provide ad delivery or retargeting and store user preferences',
        ],
    ],
    'google_analytics_4' => [
        'description' => 'Google Analytics is a statistics service and uses cookies to collect data on website visitors. Google may use the data collected to contextualize and personalize the ads of its advertising network. You can get more information about Google Analytics and how to opt out of data collection by visiting the Google Analytics website.',
        'cookies' => [
            '_ga' => 'Used to distinguish users.',
            '_ga_*' => 'Used to maintain session status.',
        ],
    ],
    'google_gemini' => [
        'description' => 'Google Gemini is an artificial intelligence service that we use to provide some features of our website. The texts, files and other content sent to these features, which may include personal data, are transmitted to Google Gemini for processing.',
    ],
    'google_maps' => [
        'description' => 'Google Maps is a map service that allows us to show interactive maps on our website. When a map is loaded, Google receives the visitor\'s IP address and may set cookies that it also uses to show ads to signed-out users.',
        'cookies' => [
            'NID' => 'Stores preferences and other information, and can be used by Google to show ads to signed-out users.',
        ],
    ],
    'google_recaptcha' => [
        'description' => 'Google reCAPTCHA is a security service that protects our forms from spam and abuse by analysing how visitors interact with the page. Google processes the collected data only to provide and secure the service.',
        'cookies' => [
            '_GRECAPTCHA' => 'Used for the risk analysis that tells humans from bots.',
        ],
    ],
    'google_tag_manager' => [
        'description' => 'Google Tag Manager is a service that allows to add and manage various marketing and analytics tags through a single interface. Google Tag Manager does not collect any personal information, but it may pass data to other services such as Google Analytics, Google Ads, and others. You can learn more about Google Tag Manager and its data practices by visiting the Google Tag Manager website.',
    ],
    'groq' => [
        'description' => 'Groq is an artificial intelligence service that we use to provide some features of our website. The texts, files and other content sent to these features, which may include personal data, are transmitted to Groq for processing.',
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
            'MUID' => 'Identifies unique web browsers visiting Microsoft sites.',
            'MR' => 'Indicates whether to refresh the MUID cookie.',
            'ANONCHK' => 'Indicates whether the MUID cookie is transferred to the advertising cookie ANID. Clarity does not use ANID, so it is always set to 0.',
            'SM' => 'Used to synchronize the MUID cookie across Microsoft domains.',
        ],
    ],
    'mistral' => [
        'description' => 'Mistral AI is an artificial intelligence service that we use to provide some features of our website. The texts, files and other content sent to these features, which may include personal data, are transmitted to Mistral AI for processing.',
    ],
    'openai' => [
        'description' => 'OpenAI is an artificial intelligence service that we use to provide some features of our website. The texts, files and other content sent to these features, which may include personal data, are transmitted to OpenAI for processing.',
    ],
    'openrouter' => [
        'description' => 'OpenRouter is a service that forwards requests to the artificial intelligence models of several providers. The texts, files and other content sent to the features of our website that use it, which may include personal data, are transmitted to OpenRouter and to the providers of the models used.',
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
    'typesafe' => [
        'description' => 'TypeSafe is an artificial intelligence service that we use to provide some features of our website. The texts, files and other content sent to these features, which may include personal data, are transmitted to TypeSafe for processing.',
    ],
    'vimeo' => [
        'description' => 'Vimeo is a video hosting service that allows us to show videos on our website. When a video is loaded, Vimeo receives the visitor\'s IP address and may set cookies to secure the player, remember its preferences and collect viewing statistics for the video owner.',
        'cookies' => [
            'player_clearance' => 'Used to protect the player from bots.',
            'cf_clearance' => 'Set by Cloudflare to protect the player from bots.',
            '__cf_bm' => 'Set by Cloudflare to recognize bot traffic.',
            '_cfuvid' => 'Set by Cloudflare to enforce rate limits.',
            'vuid' => 'Identifies the visitor to generate viewing statistics for the video owner.',
            'player' => 'Stores the player preferences, such as volume, quality and captions.',
            'flags' => 'Stores the player features enabled by the video owner.',
        ],
    ],
    'xai' => [
        'description' => 'xAI is an artificial intelligence service that we use to provide some features of our website. The texts, files and other content sent to these features, which may include personal data, are transmitted to xAI for processing.',
    ],
    'youtube' => [
        'description' => 'YouTube is a video hosting service that allows us to show videos on our website. When a video is loaded, Google receives the visitor\'s IP address and, when it is played, may set cookies and store data in the browser to secure the player, remember preferences, measure usage and personalize ads.',
        'cookies' => [
            'YSC' => 'Ensures that the requests within a browsing session are made by the user.',
            '__Secure-YEC' => 'Used to detect spam, fraud and abuse.',
            'PREF' => 'Stores preferences such as the player configuration.',
            '__Secure-ROLLOUT_TOKEN' => 'Used to launch new features and measure their impact.',
            '__Secure-YNID' => 'Used for analytics and, depending on the ad settings, for advertising.',
            'VISITOR_INFO1_LIVE' => 'Used for analytics, personalized recommendations and, depending on the ad settings, for advertising.',
        ],
    ],
    'zoho_campaigns' => [
        'description' => 'Zoho Campaigns is a marketing automation service that allows us to send emails to our customers. Zoho Campaigns may collect personal information such as names, email addresses, and browsing data.',
    ],
];
