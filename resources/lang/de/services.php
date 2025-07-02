<?php

return [
    'amazon_web_services' => [
        'description' => 'Amazon Web Services (AWS) ist ein Hosting-Dienst, der es uns ermöglicht, Daten auf sichere und zuverlässige Weise zu speichern und zu verarbeiten. Auf AWS gespeicherte Daten können persönliche Informationen wie Namen, E-Mail-Adressen und Browsing-Daten enthalten. Amazon kann die Daten gemäß seiner eigenen Datenschutzrichtlinie verwenden, die auf der Website von Amazon Web Services zu finden ist. Wir ergreifen angemessene Maßnahmen, um sicherzustellen, dass auf AWS gespeicherte Daten geschützt und sicher sind, können jedoch die absolute Sicherheit von auf Servern Dritter gespeicherten Daten nicht garantieren.',
    ],
    'digital_ocean' => [
        'description' => 'DigitalOcean ist ein Hosting-Dienst, der es uns ermöglicht, Daten auf sichere und zuverlässige Weise zu speichern und zu verarbeiten. Auf DigitalOcean gespeicherte Daten können persönliche Informationen wie Namen, E-Mail-Adressen und Browsing-Daten enthalten. DigitalOcean kann die Daten gemäß seiner eigenen Datenschutzrichtlinie verwenden, die auf der Website von DigitalOcean zu finden ist.',
    ],
    'facebook_pixel' => [
        'description' => 'Facebook Pixel verwendet Cookies, um Daten über Website-Besucher zu sammeln. Die von Facebook Pixel gesammelten Daten sind anonym und enthalten keine persönlichen Informationen. Facebook kann die gesammelten Daten verwenden, um Anzeigen an Website-Besucher zu richten und die Wirksamkeit von Facebook-Werbekampagnen zu verstehen. Weitere Informationen zu Facebook Pixel und wie Sie der Datensammlung widersprechen können, finden Sie auf der Facebook-Website.',
        'cookies' => [
            '_fbp' => 'Wird verwendet, um Besuche auf Websites zu speichern und zu verfolgen.',
            'fr' => 'Wird verwendet, um Anzeigen auszuliefern oder neu zu zielen.',
        ],
    ],
    'google_ads_remarketing' => [
        'description' => 'Google Ads Remarketing ist ein Dienst, der es uns ermöglicht, Anzeigen für Benutzer anzuzeigen, die unsere Website zuvor besucht haben. Google Ads Remarketing verwendet Cookies, um Daten über Website-Besucher zu sammeln. Die von Google Ads Remarketing gesammelten Daten sind anonym und enthalten keine persönlichen Informationen. Google kann die gesammelten Daten verwenden, um Anzeigen an Website-Besucher zu richten und die Wirksamkeit von Google-Werbekampagnen zu verstehen. Weitere Informationen zu Google Ads Remarketing und wie Sie der Datensammlung widersprechen können, finden Sie auf der Google Ads-Website.',
        'cookies' => [
            '_generic' => 'Wird verwendet, um Anzeigen auszuliefern oder neu zu zielen.',
            'NID' => 'Wird verwendet, um Anzeigen auszuliefern oder neu zu zielen und die Benutzereinstellungen zu speichern.',
            'CONSENT' => 'Wird verwendet, um Zustimmungseinstellungen zu speichern.',
            'HSID' => 'Wird verwendet, um Betrugsprävention bereitzustellen.',
            'SID' => 'Wird verwendet, um Anzeigen auszuliefern oder neu zu zielen und Betrugsprävention bereitzustellen.',
            '_gac_*' => 'Wird verwendet, um die Reichweite des Publikums zu speichern und zu verfolgen.',
        ],
    ],
    'google_analytics_4' => [
        'description' => 'Google Analytics ist ein Statistikdienst und verwendet Cookies, um Daten über Website-Besucher zu sammeln. Die von Google Analytics gesammelten Daten sind anonym und enthalten keine persönlichen Informationen. Google kann die gesammelten Daten verwenden, um Anzeigen seines Werbenetzwerks zu kontextualisieren und zu personalisieren. Weitere Informationen zu Google Analytics und wie Sie der Datensammlung widersprechen können, finden Sie auf der Google Analytics-Website.',
        'cookies' => [
            '_ga' => 'Wird verwendet, um Benutzer zu unterscheiden.',
            '_ga_*' => 'Wird verwendet, um den Sitzungsstatus aufrechtzuerhalten.',
        ],
    ],
    'google_tag_manager' => [
        'description' => 'Google Tag Manager ist ein Dienst, der es ermöglicht, verschiedene Marketing- und Analysetags über eine einzige Schnittstelle hinzuzufügen und zu verwalten. Google Tag Manager erhebt keine persönlichen Informationen, kann jedoch Daten an andere Dienste wie Google Analytics, Adwords und andere weitergeben. Weitere Informationen zu Google Tag Manager und seinen Datenpraktiken finden Sie auf der Website von Google Tag Manager.',
    ],
    'klarna' => [
        'description' => 'Klarna ist ein Zahlungsdienst, der es uns ermöglicht, Ratenzahlungen von unseren Kunden anzunehmen. Klarna kann persönliche Informationen wie Namen, E-Mail-Adressen und Rechnungsinformationen sammeln, um die Eignung des Benutzers für seine Zahlungsmethoden zu bewerten und diese Zahlungsmethoden zu personalisieren.',
    ],
    'mailchimp' => [
        'description' => 'Mailchimp ist ein E-Mail-Marketingdienst, der es uns ermöglicht, E-Mails an unsere Kunden zu senden. Mailchimp kann persönliche Informationen wie Namen, E-Mail-Adressen und Browsing-Daten sammeln.',
    ],
    'microsoft_clarity' => [
        'description' => 'Microsoft Clarity ist ein Analysedienst, der es uns ermöglicht, Daten über die Nutzung unserer Website zu sammeln, um deren Betrieb zu verbessern. Microsoft kann Informationen wie Klicks, Mausbewegungen, besuchte Seiten und andere Verhaltensdaten sammeln.',
        'cookies' => [
            '_clck' => 'Speichert die Clarity-Benutzer-ID und Einstellungen, die für diese Website eindeutig sind und demselben Benutzer zugeordnet werden.',
            '_clsk' => 'Verbindet mehrere Seitenaufrufe eines Nutzers zu einer einzigen Clarity-Sitzungsaufzeichnung.',
            'CLID' => 'Identifiziert das erste Mal, dass Clarity diesen Nutzer auf einer beliebigen Website mit Clarity gesehen hat.',
        ],
    ],
    'paypal' => [
        'description' => 'PayPal ist ein Zahlungsdienst, der es uns ermöglicht, Zahlungen von unseren Kunden anzunehmen. PayPal kann persönliche Informationen wie Namen, E-Mail-Adressen und Rechnungsinformationen sammeln.',
    ],
    'posthog_analytics' => [
        'description' => 'PostHog Analytics ist ein Statistikdienst, der es uns ermöglicht, Daten über die Nutzung unserer Website zu sammeln, um deren Funktionalität zu verbessern. PostHog kann personenbezogene Daten wie Namen, E-Mail-Adressen und Navigationsdaten erfassen.',
        'cookies' => [
            'ph_phc_*' => 'Wird verwendet, um Informationen über das Nutzerverhalten zu erhalten',
        ],
    ],
    'scalapay' => [
        'description' => 'Scalapay ist ein Zahlungsdienst, der es uns ermöglicht, Ratenzahlungen von unseren Kunden anzunehmen. Scalapay kann persönliche Informationen wie Namen, E-Mail-Adressen und Rechnungsinformationen sammeln, um die Eignung des Benutzers für seine Zahlungsmethoden zu bewerten und diese Zahlungsmethoden zu personalisieren.',
    ],
    'stripe' => [
        'description' => 'Stripe ist ein Zahlungsdienst, der es uns ermöglicht, Zahlungen von unseren Kunden anzunehmen. Stripe kann persönliche Informationen wie Namen, E-Mail-Adressen und Rechnungsinformationen sammeln.',
    ],
    'zoho_campaigns' => [
        'description' => 'Zoho Campaigns ist ein Marketing-Automatisierungsdienst, der es uns ermöglicht, E-Mails an unsere Kunden zu senden. Zoho Campaigns kann persönliche Informationen wie Namen, E-Mail-Adressen und Browsing-Daten sammeln.',
    ],
];
