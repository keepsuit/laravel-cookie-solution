<?php

return [
    'amazon_web_services' => [
        'description' => "Amazon Web Services (AWS) è un servizio di hosting che ci consente di archiviare ed elaborare i dati in modo sicuro e affidabile. I dati archiviati su AWS possono includere informazioni personali come nomi, indirizzi e-mail e dati di navigazione. Amazon può utilizzare i dati in conformità con la propria politica sulla privacy, che può essere trovata sul sito web di Amazon Web Services. Adottiamo misure ragionevoli per garantire che i dati archiviati su AWS siano protetti e sicuri, ma non possiamo garantire l'assoluta sicurezza dei dati archiviati su server di terze parti.",
    ],
    'digital_ocean' => [
        'description' => 'DigitalOcean è un servizio di hosting che ci consente di archiviare ed elaborare i dati in modo sicuro e affidabile. I dati archiviati su DigitalOcean possono includere informazioni personali come nomi, indirizzi e-mail e dati di navigazione. DigitalOcean può utilizzare i dati in conformità con la propria politica sulla privacy, che può essere trovata sul sito web di DigitalOcean.',
    ],
    'facebook_pixel' => [
        'description' => "Facebook Pixel utilizza i cookie per raccogliere dati sui visitatori del sito web. I dati raccolti da Facebook Pixel sono anonimi e non includono informazioni personali. Facebook può utilizzare i dati raccolti per indirizzare gli annunci ai visitatori del sito Web e per comprendere l'efficacia delle campagne pubblicitarie di Facebook. Puoi saperne di più su Facebook Pixel e su come rinunciare alla raccolta dei dati visitando il sito web di Facebook.",
        'cookies' => [
            '_fbp' => 'Utilizzato per memorizzare e tracciare le visite su siti Web.',
            'fr' => 'Utilizzato per gli annunci o il retargeting.',
        ],
    ],
    'google_ads_remarketing' => [
        'description' => 'Google Ads Remarketing è un servizio che ci consente di mostrare annunci agli utenti che hanno precedentemente visitato il nostro sito web. Google Ads Remarketing utilizza i cookie per raccogliere dati sui visitatori del sito web. I dati raccolti da Google Ads Remarketing sono anonimi e non includono informazioni personali. Google potrebbe utilizzare i dati raccolti per indirizzare gli annunci ai visitatori del sito web e comprendere l\'efficacia delle campagne pubblicitarie di Google. È possibile ottenere ulteriori informazioni su Google Ads Remarketing e su come disattivare la raccolta di dati visitando il sito web di Google Ads.',
        'cookies' => [
            '_generic' => 'Utilizzato per fornire la pubblicazione di annunci o il retargeting',
            'NID' => 'Utilizzato per fornire la pubblicazione di annunci o il retargeting e salvare le preferenze dell\'utente',
            'CONSENT' => 'Utilizzato per salvare le preferenze di consenso',
            'HSID' => 'Utilizzato per fornire prevenzione delle frodi',
            'SID' => 'Utilizzato per fornire pubblicità o retargeting e la prevenzione delle frodi',
            '_gac_*' => 'Utilizzato per memorizzare e monitorare la portata del pubblico',
        ],
    ],
    'google_analytics_4' => [
        'description' => 'Google Analytics è un servizio di statistica e utilizza i cookie per raccogliere dati sui visitatori del sito web. I dati raccolti da Google Analytics sono anonimi e non includono informazioni personali. Google potrebbe utilizzare i dati raccolti per contestualizzare e personalizzare gli annunci del proprio network pubblicitario. È possibile ottenere ulteriori informazioni su Google Analytics e su come disattivare la raccolta di dati visitando il sito web di Google Analytics.',
        'cookies' => [
            '_ga' => 'Utilizzato per distinguere gli utenti.',
            '_ga_*' => 'Utilizzato per mantenere lo stato della sessione.',
        ],
    ],
    'google_tag_manager' => [
        'description' => "Google Tag Manager è un servizio che consente di aggiungere e gestire diversi tag di marketing e analisi attraverso un'unica interfaccia. Google Tag Manager non raccoglie alcuna informazione personale, ma può trasferire i dati ad altri servizi come Google Analytics, Adwords e altri. Puoi saperne di più su Google Tag Manager e sulle sue pratiche relative ai dati visitando il sito web di Google Tag Manager.",
    ],
    'klarna' => [
        'description' => 'Klarna è un servizio di pagamento che ci consente di accettare pagamenti a rate dai nostri clienti. Klarna potrebbe raccogliere informazioni personali come nomi, indirizzi e-mail e informazioni di fatturazione per valutare l\'idoneità dell\'utente ai suoi metodi di pagamento e personalizzare tali metodi di pagamento.',
    ],
    'mailchimp' => [
        'description' => 'Mailchimp è un servizio di email marketing che ci permette di inviare email ai nostri clienti. Mailchimp potrebbe raccogliere informazioni personali come nomi, indirizzi e-mail e dati di navigazione.',
    ],
    'microsoft_clarity' => [
        'description' => 'Microsoft Clarity è un servizio di analisi che ci consente di raccogliere dati sull\'utilizzo del nostro sito web per migliorarne il funzionamento. Microsoft potrebbe raccogliere informazioni come click, movimenti del mouse, pagine visitate e altri dati comportamentali.',
        'cookies' => [
            '_clck' => 'Identifica in modo univoco un visitatore per Clarity, per capire se si tratta di un utente ricorrente.',
            '_clsk' => 'Collega le pagine visualizzate da un utente in una singola sessione di Clarity.',
            'CLID' => '	Identifica in modo univoco i visitatori nei diversi siti che utilizzano Clarity.',
        ],
    ],
    'paypal' => [
        'description' => 'PayPal è un servizio di pagamento che ci consente di accettare pagamenti dai nostri clienti. PayPal potrebbe raccogliere informazioni personali come nomi, indirizzi e-mail e informazioni di fatturazione.',
    ],
    'posthog_analytics' => [
        'description' => 'PostHog analytics è un servizio di statistica che ci consente di raccogliere dati sull\'utilizzo del nostro sito web per migliorarne il funzionamento. PostHog potrebbe raccogliere informazioni personali come nomi, indirizzi e-mail e dati di navigazione.',
        'cookies' => [
            'ph_phc_*' => 'Utilizzato per ottenere informazioni sul comportamento degli utenti',
        ],
    ],
    'scalapay' => [
        'description' => 'Scalapay è un servizio di pagamento che ci consente di accettare pagamenti a rate dai nostri clienti. Scalapay potrebbe raccogliere informazioni personali come nomi, indirizzi e-mail e informazioni di fatturazione per valutare l\'idoneità dell\'utente ai suoi metodi di pagamento e personalizzare tali metodi di pagamento.',
    ],
    'stripe' => [
        'description' => 'Stripe è un servizio di pagamento che ci consente di accettare pagamenti dai nostri clienti. Stripe potrebbe raccogliere informazioni personali come nomi, indirizzi e-mail e informazioni di fatturazione.',
    ],
    'zoho_campaigns' => [
        'description' => 'Zoho Campaigns è un servizio di marketing che ci consente di inviare e-mail ai nostri clienti. Zoho Campaigns potrebbe raccogliere informazioni personali come nomi, indirizzi e-mail e dati di navigazione.',
    ],
];
