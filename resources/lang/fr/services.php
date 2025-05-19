<?php

return [
    'amazon_web_services' => [
        'description' => 'Amazon Web Services (AWS) est un service d\'hébergement qui nous permet de stocker et de traiter des données de manière sécurisée et fiable. Les données stockées sur AWS peuvent inclure des informations personnelles telles que des noms, des adresses électroniques et des données de navigation. Amazon peut utiliser les données conformément à sa propre politique de confidentialité, qui peut être consultée sur le site Web d\'Amazon Web Services. Nous prenons des mesures raisonnables pour garantir que les données stockées sur AWS sont protégées et sécurisées, mais nous ne pouvons pas garantir la sécurité absolue des données stockées sur des serveurs tiers.',
    ],
    'digital_ocean' => [
        'description' => 'DigitalOcean est un service d\'hébergement qui nous permet de stocker et de traiter des données de manière sécurisée et fiable. Les données stockées sur DigitalOcean peuvent inclure des informations personnelles telles que des noms, des adresses électroniques et des données de navigation. DigitalOcean peut utiliser les données conformément à sa propre politique de confidentialité, qui peut être consultée sur le site Web de DigitalOcean.',
    ],
    'facebook_pixel' => [
        'description' => 'Facebook Pixel utilise des cookies pour collecter des données sur les visiteurs du site Web. Les données collectées par Facebook Pixel sont anonymes et ne comprennent pas d\'informations personnelles. Facebook peut utiliser les données collectées pour cibler des publicités auprès des visiteurs du site Web et pour comprendre l\'efficacité des campagnes publicitaires de Facebook. Vous pouvez en savoir plus sur Facebook Pixel et sur la manière de refuser la collecte de données en visitant le site Web de Facebook.',
        'cookies' => [
            '_fbp' => 'Utilisé pour stocker et suivre les visites sur les sites Web.',
            'fr' => 'Utilisé pour la diffusion de publicités ou le reciblage.',
        ],
    ],
    'google_ads_remarketing' => [
        'description' => 'Google Ads Remarketing est un service qui nous permet d\'afficher des publicités aux utilisateurs qui ont déjà visité notre site Web. Google Ads Remarketing utilise des cookies pour collecter des données sur les visiteurs du site Web. Les données collectées par Google Ads Remarketing sont anonymes et ne comprennent pas d\'informations personnelles. Google peut utiliser les données collectées pour cibler des publicités auprès des visiteurs du site Web et pour comprendre l\'efficacité des campagnes publicitaires de Google. Vous pouvez en savoir plus sur Google Ads Remarketing et sur la manière de refuser la collecte de données en visitant le site Web de Google Ads.',
        'cookies' => [
            '_generic' => 'Utilisé pour la diffusion de publicités ou le reciblage.',
            'NID' => 'Utilisé pour la diffusion de publicités ou le reciblage et pour stocker les préférences de l\'utilisateur.',
            'CONSENT' => 'Utilisé pour stocker les préférences de consentement.',
            'HSID' => 'Utilisé pour la prévention de la fraude.',
            'SID' => 'Utilisé pour la diffusion de publicités ou le reciblage et pour la prévention de la fraude.',
            '_gac_*' => 'Utilisé pour stocker et suivre la portée de l\'audience.',
        ],
    ],
    'google_analytics_4' => [
        'description' => 'Google Analytics est un service de statistiques qui utilise des cookies pour collecter des données sur les visiteurs du site Web. Les données collectées par Google Analytics sont anonymes et ne comprennent pas d\'informations personnelles. Google peut utiliser les données collectées pour contextualiser et personnaliser les publicités de son réseau publicitaire. Vous pouvez obtenir plus d\'informations sur Google Analytics et sur la manière de refuser la collecte de données en visitant le site Web de Google Analytics.',
        'cookies' => [
            '_ga' => 'Utilisé pour distinguer les utilisateurs.',
            '_ga_*' => 'Utilisé pour maintenir l\'état de la session.',
        ],
    ],
    'google_tag_manager' => [
        'description' => 'Google Tag Manager est un service qui permet d\'ajouter et de gérer diverses balises marketing et analytiques via une seule interface. Google Tag Manager ne collecte aucune information personnelle, mais il peut transmettre des données à d\'autres services tels que Google Analytics, Adwords, et d\'autres. Vous pouvez en savoir plus sur Google Tag Manager et sur ses pratiques en matière de données en visitant le site Web de Google Tag Manager.',
    ],
    'klarna' => [
        'description' => 'Klarna est un service de paiement qui nous permet d\'accepter des paiements échelonnés de nos clients. Klarna peut collecter des informations personnelles telles que des noms, des adresses électroniques et des informations de facturation afin d\'évaluer l\'adéquation de l\'utilisateur à ses méthodes de paiement et de personnaliser ces méthodes de paiement.',
    ],
    'mailchimp' => [
        'description' => 'Mailchimp est un service de marketing par e-mail qui nous permet d\'envoyer des e-mails à nos clients. Mailchimp peut collecter des informations personnelles telles que des noms, des adresses électroniques et des données de navigation.',
    ],
    'paypal' => [
        'description' => 'PayPal est un service de paiement qui nous permet d\'accepter des paiements de nos clients. PayPal peut collecter des informations personnelles telles que des noms, des adresses électroniques et des informations de facturation.',
    ],
    'posthog_analytics' => [
        'description' => 'PostHog analytics est un service de statistiques qui nous permet de collecter des données sur l’utilisation de notre site web afin d’en améliorer le fonctionnement. PostHog peut recueillir des informations personnelles telles que les noms, adresses e-mail et données de navigation.',
        'cookies' => [
            'ph_phc_*' => 'Utilisé pour obtenir des informations sur le comportement des utilisateurs',
        ],
    ],
    'scalapay' => [
        'description' => 'Scalapay est un service de paiement qui nous permet d\'accepter des paiements échelonnés de nos clients. Scalapay peut collecter des informations personnelles telles que des noms, des adresses électroniques et des informations de facturation afin d\'évaluer l\'adéquation de l\'utilisateur à ses méthodes de paiement et de personnaliser ces méthodes de paiement.',
    ],
    'stripe' => [
        'description' => 'Stripe est un service de paiement qui nous permet d\'accepter des paiements de nos clients. Stripe peut collecter des informations personnelles telles que des noms, des adresses électroniques et des informations de facturation.',
    ],
    'zoho_campaigns' => [
        'description' => 'Zoho Campaigns est un service d\'automatisation du marketing qui nous permet d\'envoyer des e-mails à nos clients. Zoho Campaigns peut collecter des informations personnelles telles que des noms, des adresses électroniques et des données de navigation.',
    ],
];
