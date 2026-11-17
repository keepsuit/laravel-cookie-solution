<?php

return [
    'amazon_web_services' => [
        'description' => 'Amazon Web Services (AWS) est un service d\'hébergement qui nous permet de stocker et de traiter des données de manière sécurisée et fiable. Les données stockées sur AWS peuvent inclure des informations personnelles telles que des noms, des adresses électroniques et des données de navigation. Amazon peut utiliser les données conformément à sa propre politique de confidentialité, qui peut être consultée sur le site Web d\'Amazon Web Services. Nous prenons des mesures raisonnables pour garantir que les données stockées sur AWS sont protégées et sécurisées, mais nous ne pouvons pas garantir la sécurité absolue des données stockées sur des serveurs tiers.',
    ],
    'digital_ocean' => [
        'description' => 'DigitalOcean est un service d\'hébergement qui nous permet de stocker et de traiter des données de manière sécurisée et fiable. Les données stockées sur DigitalOcean peuvent inclure des informations personnelles telles que des noms, des adresses électroniques et des données de navigation. DigitalOcean peut utiliser les données conformément à sa propre politique de confidentialité, qui peut être consultée sur le site Web de DigitalOcean.',
    ],
    'facebook_pixel' => [
        'description' => 'Meta Pixel utilise des cookies pour collecter des données sur les visiteurs du site Web. Meta peut utiliser les données collectées pour cibler des publicités auprès des visiteurs du site Web et pour comprendre l\'efficacité des campagnes publicitaires de Meta. Vous pouvez en savoir plus sur Meta Pixel et sur la manière de refuser la collecte de données en visitant le site Web de Meta.',
        'cookies' => [
            '_fbp' => 'Utilisé pour stocker et suivre les visites sur les sites Web.',
            '_fbc' => 'Utilisé pour stocker l\'identifiant du clic publicitaire et attribuer les conversions.',
            'fr' => 'Utilisé pour la diffusion de publicités ou le reciblage.',
        ],
    ],
    'google_ads_remarketing' => [
        'description' => 'Google Ads Remarketing est un service qui nous permet d\'afficher des publicités aux utilisateurs qui ont déjà visité notre site Web. Google Ads Remarketing utilise des cookies pour collecter des données sur les visiteurs du site Web. Google peut utiliser les données collectées pour cibler des publicités auprès des visiteurs du site Web et pour comprendre l\'efficacité des campagnes publicitaires de Google. Vous pouvez en savoir plus sur Google Ads Remarketing et sur la manière de refuser la collecte de données en visitant le site Web de Google Ads.',
        'cookies' => [
            '_generic' => 'Utilisé pour la diffusion de publicités ou le reciblage.',
            '_conversion' => 'Utilisé pour stocker les informations sur les clics publicitaires et attribuer les conversions.',
            'NID' => 'Utilisé pour la diffusion de publicités ou le reciblage et pour stocker les préférences de l\'utilisateur.',
        ],
    ],
    'google_analytics_4' => [
        'description' => 'Google Analytics est un service de statistiques qui utilise des cookies pour collecter des données sur les visiteurs du site Web. Google peut utiliser les données collectées pour contextualiser et personnaliser les publicités de son réseau publicitaire. Vous pouvez obtenir plus d\'informations sur Google Analytics et sur la manière de refuser la collecte de données en visitant le site Web de Google Analytics.',
        'cookies' => [
            '_ga' => 'Utilisé pour distinguer les utilisateurs.',
            '_ga_*' => 'Utilisé pour maintenir l\'état de la session.',
        ],
    ],
    'google_maps' => [
        'description' => 'Google Maps est un service de cartographie qui nous permet d\'afficher des cartes interactives sur notre site web. Au chargement d\'une carte, Google reçoit l\'adresse IP du visiteur et peut déposer des cookies qu\'il utilise aussi pour afficher des annonces aux utilisateurs non connectés.',
        'cookies' => [
            'NID' => 'Enregistre des préférences et d\'autres informations, et peut être utilisé par Google pour afficher des annonces aux utilisateurs non connectés.',
        ],
    ],
    'google_recaptcha' => [
        'description' => 'Google reCAPTCHA est un service de sécurité qui protège nos formulaires contre le spam et les abus en analysant la façon dont les visiteurs interagissent avec la page. Google traite les données collectées uniquement pour fournir et sécuriser le service.',
        'cookies' => [
            '_GRECAPTCHA' => 'Utilisé pour l\'analyse de risque qui distingue les humains des robots.',
        ],
    ],
    'google_tag_manager' => [
        'description' => 'Google Tag Manager est un service qui permet d\'ajouter et de gérer diverses balises marketing et analytiques via une seule interface. Google Tag Manager ne collecte aucune information personnelle, mais il peut transmettre des données à d\'autres services tels que Google Analytics, Google Ads, et d\'autres. Vous pouvez en savoir plus sur Google Tag Manager et sur ses pratiques en matière de données en visitant le site Web de Google Tag Manager.',
    ],
    'klarna' => [
        'description' => 'Klarna est un service de paiement qui nous permet d\'accepter des paiements échelonnés de nos clients. Klarna peut collecter des informations personnelles telles que des noms, des adresses électroniques et des informations de facturation afin d\'évaluer l\'adéquation de l\'utilisateur à ses méthodes de paiement et de personnaliser ces méthodes de paiement.',
    ],
    'mailchimp' => [
        'description' => 'Mailchimp est un service de marketing par e-mail qui nous permet d\'envoyer des e-mails à nos clients. Mailchimp peut collecter des informations personnelles telles que des noms, des adresses électroniques et des données de navigation.',
    ],
    'microsoft_clarity' => [
        'description' => "Microsoft Clarity est un service d'analyse qui nous permet de collecter des données sur l'utilisation de notre site web afin d'en améliorer le fonctionnement. Microsoft peut collecter des informations telles que les clics, les mouvements de la souris, les pages visitées et d'autres données comportementales.",
        'cookies' => [
            '_clck' => "Conserve l'identifiant utilisateur Clarity et les préférences, unique à ce site et attribué au même identifiant utilisateur.",
            '_clsk' => 'Relie plusieurs pages vues par un utilisateur en un seul enregistrement de session Clarity.',
            'CLID' => "Identifie la première fois que Clarity a vu cet utilisateur sur n'importe quel site utilisant Clarity.",
            'MUID' => 'Identifie de manière unique les navigateurs qui visitent les sites Microsoft.',
            'MR' => "Indique s'il faut actualiser le cookie MUID.",
            'ANONCHK' => "Indique si le cookie MUID est transféré au cookie publicitaire ANID. Clarity n'utilise pas ANID, la valeur est donc toujours 0.",
            'SM' => 'Utilisé pour synchroniser le cookie MUID entre les domaines Microsoft.',
        ],
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
    'vimeo' => [
        'description' => 'Vimeo est un service d\'hébergement vidéo qui nous permet d\'afficher des vidéos sur notre site web. Au chargement d\'une vidéo, Vimeo reçoit l\'adresse IP du visiteur et peut déposer des cookies pour sécuriser le lecteur, mémoriser ses préférences et collecter des statistiques de visionnage pour le propriétaire de la vidéo.',
        'cookies' => [
            'player_clearance' => 'Utilisé pour protéger le lecteur contre les robots.',
            'cf_clearance' => 'Déposé par Cloudflare pour protéger le lecteur contre les robots.',
            '__cf_bm' => 'Déposé par Cloudflare pour reconnaître le trafic des robots.',
            '_cfuvid' => 'Déposé par Cloudflare pour appliquer les limites de fréquence des requêtes.',
            'vuid' => 'Identifie le visiteur pour générer des statistiques de visionnage pour le propriétaire de la vidéo.',
            'player' => 'Enregistre les préférences du lecteur, comme le volume, la qualité et les sous-titres.',
            'flags' => 'Enregistre les fonctionnalités du lecteur activées par le propriétaire de la vidéo.',
        ],
    ],
    'youtube' => [
        'description' => 'YouTube est un service d\'hébergement vidéo qui nous permet d\'afficher des vidéos sur notre site web. Au chargement d\'une vidéo, Google reçoit l\'adresse IP du visiteur et, lors de la lecture, peut déposer des cookies et enregistrer des données dans le navigateur pour sécuriser le lecteur, mémoriser les préférences, mesurer l\'utilisation et personnaliser les annonces.',
        'cookies' => [
            'YSC' => 'Garantit que les requêtes d\'une session de navigation proviennent de l\'utilisateur.',
            '__Secure-YEC' => 'Utilisé pour détecter le spam, la fraude et les abus.',
            'PREF' => 'Enregistre des préférences comme la configuration du lecteur.',
            '__Secure-ROLLOUT_TOKEN' => 'Utilisé pour lancer de nouvelles fonctionnalités et mesurer leur impact.',
            '__Secure-YNID' => 'Utilisé pour les statistiques et, selon les paramètres des annonces, pour la publicité.',
            'VISITOR_INFO1_LIVE' => 'Utilisé pour les statistiques, les recommandations personnalisées et, selon les paramètres des annonces, pour la publicité.',
        ],
    ],
    'zoho_campaigns' => [
        'description' => 'Zoho Campaigns est un service d\'automatisation du marketing qui nous permet d\'envoyer des e-mails à nos clients. Zoho Campaigns peut collecter des informations personnelles telles que des noms, des adresses électroniques et des données de navigation.',
    ],
];
