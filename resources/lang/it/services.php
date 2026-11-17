<?php

return [
    'amazon_web_services' => [
        'description' => "Amazon Web Services (AWS) è un servizio di hosting che ci consente di archiviare ed elaborare i dati in modo sicuro e affidabile. I dati archiviati su AWS possono includere informazioni personali come nomi, indirizzi e-mail e dati di navigazione. Amazon può utilizzare i dati in conformità con la propria politica sulla privacy, che può essere trovata sul sito web di Amazon Web Services. Adottiamo misure ragionevoli per garantire che i dati archiviati su AWS siano protetti e sicuri, ma non possiamo garantire l'assoluta sicurezza dei dati archiviati su server di terze parti.",
    ],
    'digital_ocean' => [
        'description' => 'DigitalOcean è un servizio di hosting che ci consente di archiviare ed elaborare i dati in modo sicuro e affidabile. I dati archiviati su DigitalOcean possono includere informazioni personali come nomi, indirizzi e-mail e dati di navigazione. DigitalOcean può utilizzare i dati in conformità con la propria politica sulla privacy, che può essere trovata sul sito web di DigitalOcean.',
    ],
    'facebook_pixel' => [
        'description' => "Meta Pixel utilizza i cookie per raccogliere dati sui visitatori del sito web. Meta può utilizzare i dati raccolti per indirizzare gli annunci ai visitatori del sito Web e per comprendere l'efficacia delle campagne pubblicitarie di Meta. Puoi saperne di più su Meta Pixel e su come rinunciare alla raccolta dei dati visitando il sito web di Meta.",
        'cookies' => [
            '_fbp' => 'Utilizzato per memorizzare e tracciare le visite su siti Web.',
            '_fbc' => 'Utilizzato per memorizzare l\'identificativo del click sull\'annuncio e attribuire le conversioni.',
            'fr' => 'Utilizzato per gli annunci o il retargeting.',
        ],
    ],
    'google_ads_remarketing' => [
        'description' => 'Google Ads Remarketing è un servizio che ci consente di mostrare annunci agli utenti che hanno precedentemente visitato il nostro sito web. Google Ads Remarketing utilizza i cookie per raccogliere dati sui visitatori del sito web. Google potrebbe utilizzare i dati raccolti per indirizzare gli annunci ai visitatori del sito web e comprendere l\'efficacia delle campagne pubblicitarie di Google. È possibile ottenere ulteriori informazioni su Google Ads Remarketing e su come disattivare la raccolta di dati visitando il sito web di Google Ads.',
        'cookies' => [
            '_generic' => 'Utilizzato per fornire la pubblicazione di annunci o il retargeting',
            '_conversion' => 'Utilizzato per memorizzare le informazioni sui click sugli annunci e attribuire le conversioni',
            'NID' => 'Utilizzato per fornire la pubblicazione di annunci o il retargeting e salvare le preferenze dell\'utente',
        ],
    ],
    'google_analytics_4' => [
        'description' => 'Google Analytics è un servizio di statistica e utilizza i cookie per raccogliere dati sui visitatori del sito web. Google potrebbe utilizzare i dati raccolti per contestualizzare e personalizzare gli annunci del proprio network pubblicitario. È possibile ottenere ulteriori informazioni su Google Analytics e su come disattivare la raccolta di dati visitando il sito web di Google Analytics.',
        'cookies' => [
            '_ga' => 'Utilizzato per distinguere gli utenti.',
            '_ga_*' => 'Utilizzato per mantenere lo stato della sessione.',
        ],
    ],
    'google_maps' => [
        'description' => 'Google Maps è un servizio di mappe che ci consente di mostrare mappe interattive sul nostro sito web. Al caricamento di una mappa Google riceve l\'indirizzo IP del visitatore e può impostare cookie che utilizza anche per mostrare annunci agli utenti non autenticati.',
        'cookies' => [
            'NID' => 'Memorizza preferenze e altre informazioni e può essere utilizzato da Google per mostrare annunci agli utenti non autenticati.',
        ],
    ],
    'google_recaptcha' => [
        'description' => 'Google reCAPTCHA è un servizio di sicurezza che protegge i nostri moduli da spam e abusi analizzando come i visitatori interagiscono con la pagina. Google tratta i dati raccolti solo per fornire e proteggere il servizio.',
        'cookies' => [
            '_GRECAPTCHA' => 'Utilizzato per l\'analisi del rischio che distingue le persone dai bot.',
        ],
    ],
    'google_tag_manager' => [
        'description' => "Google Tag Manager è un servizio che consente di aggiungere e gestire diversi tag di marketing e analisi attraverso un'unica interfaccia. Google Tag Manager non raccoglie alcuna informazione personale, ma può trasferire i dati ad altri servizi come Google Analytics, Google Ads e altri. Puoi saperne di più su Google Tag Manager e sulle sue pratiche relative ai dati visitando il sito web di Google Tag Manager.",
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
            'CLID' => 'Identifica in modo univoco i visitatori nei diversi siti che utilizzano Clarity.',
            'MUID' => 'Identifica in modo univoco i browser che visitano siti Microsoft.',
            'MR' => 'Indica se aggiornare il cookie MUID.',
            'ANONCHK' => 'Indica se il cookie MUID viene trasferito al cookie pubblicitario ANID. Clarity non utilizza ANID, quindi il valore è sempre 0.',
            'SM' => 'Utilizzato per sincronizzare il cookie MUID tra i domini Microsoft.',
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
    'vimeo' => [
        'description' => 'Vimeo è un servizio di hosting video che ci consente di mostrare video sul nostro sito web. Al caricamento di un video Vimeo riceve l\'indirizzo IP del visitatore e può impostare cookie per proteggere il player, ricordarne le preferenze e raccogliere statistiche di visualizzazione per il proprietario del video.',
        'cookies' => [
            'player_clearance' => 'Utilizzato per proteggere il player dai bot.',
            'cf_clearance' => 'Impostato da Cloudflare per proteggere il player dai bot.',
            '__cf_bm' => 'Impostato da Cloudflare per riconoscere il traffico dei bot.',
            '_cfuvid' => 'Impostato da Cloudflare per applicare i limiti di frequenza delle richieste.',
            'vuid' => 'Identifica il visitatore per generare statistiche di visualizzazione per il proprietario del video.',
            'player' => 'Memorizza le preferenze del player, come volume, qualità e sottotitoli.',
            'flags' => 'Memorizza le funzioni del player attivate dal proprietario del video.',
        ],
    ],
    'youtube' => [
        'description' => 'YouTube è un servizio di hosting video che ci consente di mostrare video sul nostro sito web. Al caricamento di un video Google riceve l\'indirizzo IP del visitatore e, alla riproduzione, può impostare cookie e salvare dati nel browser per proteggere il player, ricordare le preferenze, misurare l\'utilizzo e personalizzare gli annunci.',
        'cookies' => [
            'YSC' => 'Verifica che le richieste di una sessione di navigazione provengano dall\'utente.',
            '__Secure-YEC' => 'Utilizzato per rilevare spam, frodi e abusi.',
            'PREF' => 'Memorizza preferenze come la configurazione del player.',
            '__Secure-ROLLOUT_TOKEN' => 'Utilizzato per introdurre nuove funzioni e misurarne l\'impatto.',
            '__Secure-YNID' => 'Utilizzato per statistiche e, in base alle impostazioni degli annunci, per la pubblicità.',
            'VISITOR_INFO1_LIVE' => 'Utilizzato per statistiche, consigli personalizzati e, in base alle impostazioni degli annunci, per la pubblicità.',
        ],
    ],
    'zoho_campaigns' => [
        'description' => 'Zoho Campaigns è un servizio di marketing che ci consente di inviare e-mail ai nostri clienti. Zoho Campaigns potrebbe raccogliere informazioni personali come nomi, indirizzi e-mail e dati di navigazione.',
    ],
];
