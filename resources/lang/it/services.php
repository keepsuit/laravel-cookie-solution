<?php

return [
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
    'facebook_pixel' => [
        'description' => "Facebook Pixel utilizza i cookie per raccogliere dati sui visitatori del sito web. I dati raccolti da Facebook Pixel sono anonimi e non includono informazioni personali. Facebook può utilizzare i dati raccolti per indirizzare gli annunci ai visitatori del sito Web e per comprendere l'efficacia delle campagne pubblicitarie di Facebook. Puoi saperne di più su Facebook Pixel e su come rinunciare alla raccolta dei dati visitando il sito web di Facebook.",
        'cookies' => [
            '_fbp' => 'Utilizzato per memorizzare e tracciare le visite su siti Web.',
            'fr' => 'Utilizzato per gli annunci o il retargeting.',
        ],
    ],
    'amazon_web_services' => [
        'description' => "Amazon Web Services (AWS) è un servizio di hosting che ci consente di archiviare ed elaborare i dati in modo sicuro e affidabile. I dati archiviati su AWS possono includere informazioni personali come nomi, indirizzi e-mail e dati di navigazione. Amazon può utilizzare i dati in conformità con la propria politica sulla privacy, che può essere trovata sul sito web di Amazon Web Services. Adottiamo misure ragionevoli per garantire che i dati archiviati su AWS siano protetti e sicuri, ma non possiamo garantire l'assoluta sicurezza dei dati archiviati su server di terze parti.",
    ],
    'paypal' => [
        'description' => 'PayPal è un servizio di pagamento che ci consente di accettare pagamenti dai nostri clienti. PayPal potrebbe raccogliere informazioni personali come nomi, indirizzi e-mail e informazioni di fatturazione.',
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
];
