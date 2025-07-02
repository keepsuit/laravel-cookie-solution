<?php

return [
    'amazon_web_services' => [
        'description' => 'Amazon Web Services (AWS) es un servicio de alojamiento que nos permite almacenar y procesar datos de manera segura y confiable. Los datos almacenados en AWS pueden incluir información personal como nombres, direcciones de correo electrónico y datos de navegación. Amazon puede usar los datos de acuerdo con su propia política de privacidad, que se puede encontrar en el sitio web de Amazon Web Services. Tomamos medidas razonables para garantizar que los datos almacenados en AWS estén protegidos y sean seguros, pero no podemos garantizar la seguridad absoluta de los datos almacenados en servidores de terceros.',
    ],
    'digital_ocean' => [
        'description' => 'DigitalOcean es un servicio de alojamiento que nos permite almacenar y procesar datos de manera segura y confiable. Los datos almacenados en DigitalOcean pueden incluir información personal como nombres, direcciones de correo electrónico y datos de navegación. DigitalOcean puede usar los datos de acuerdo con su propia política de privacidad, que se puede encontrar en el sitio web de DigitalOcean.',
    ],
    'facebook_pixel' => [
        'description' => 'Facebook Pixel utiliza cookies para recopilar datos sobre los visitantes del sitio web. Los datos recopilados por Facebook Pixel son anónimos y no incluyen información personal. Facebook puede usar los datos recopilados para mostrar anuncios a los visitantes del sitio web y comprender la efectividad de las campañas publicitarias de Facebook. Puedes obtener más información sobre Facebook Pixel y cómo optar por no participar en la recopilación de datos visitando el sitio web de Facebook.',
        'cookies' => [
            '_fbp' => 'Se utiliza para almacenar y rastrear visitas en varios sitios web.',
            'fr' => 'Se utiliza para proporcionar entrega de anuncios o retargeting.',
        ],
    ],
    'google_ads_remarketing' => [
        'description' => 'Google Ads Remarketing es un servicio que nos permite mostrar anuncios a usuarios que han visitado previamente nuestro sitio web. Google Ads Remarketing utiliza cookies para recopilar datos sobre los visitantes del sitio web. Los datos recopilados por Google Ads Remarketing son anónimos y no incluyen información personal. Google puede usar los datos recopilados para mostrar anuncios a los visitantes del sitio web y comprender la efectividad de las campañas publicitarias de Google. Puedes obtener más información sobre Google Ads Remarketing y cómo optar por no participar en la recopilación de datos visitando el sitio web de Google Ads.',
        'cookies' => [
            '_generic' => 'Se utiliza para proporcionar entrega de anuncios o retargeting',
            'NID' => 'Se utiliza para proporcionar entrega de anuncios o retargeting y almacenar preferencias de usuario',
            'CONSENT' => 'Se utiliza para almacenar preferencias de consentimiento',
            'HSID' => 'Se utiliza para proporcionar prevención de fraude',
            'SID' => 'Se utiliza para proporcionar entrega de anuncios o retargeting y proporcionar prevención de fraude',
            '_gac_*' => 'Se utiliza para almacenar y rastrear el alcance de la audiencia',
        ],
    ],
    'google_analytics_4' => [
        'description' => 'Google Analytics es un servicio de estadísticas que utiliza cookies para recopilar datos sobre los visitantes del sitio web. Los datos recopilados por Google Analytics son anónimos y no incluyen información personal. Google puede usar los datos recopilados para contextualizar y personalizar los anuncios de su red publicitaria. Puedes obtener más información sobre Google Analytics y cómo optar por no participar en la recopilación de datos visitando el sitio web de Google Analytics.',
        'cookies' => [
            '_ga' => 'Se utiliza para distinguir usuarios.',
            '_ga_*' => 'Se utiliza para mantener el estado de la sesión.',
        ],
    ],
    'google_tag_manager' => [
        'description' => 'Google Tag Manager es un servicio que permite agregar y administrar varias etiquetas de marketing y análisis a través de una sola interfaz. Google Tag Manager no recopila ninguna información personal, pero puede enviar datos a otros servicios como Google Analytics, Adwords y otros. Puedes obtener más información sobre Google Tag Manager y sus prácticas de datos visitando el sitio web de Google Tag Manager.',
    ],
    'klarna' => [
        'description' => 'Klarna es un servicio de pago que nos permite aceptar pagos a plazos de nuestros clientes. Klarna puede recopilar información personal como nombres, direcciones de correo electrónico e información de facturación para evaluar la idoneidad del usuario para sus métodos de pago y personalizar esos métodos de pago.',
    ],
    'mailchimp' => [
        'description' => 'Mailchimp es un servicio de marketing por correo electrónico que nos permite enviar correos electrónicos a nuestros clientes. Mailchimp puede recopilar información personal como nombres, direcciones de correo electrónico y datos de navegación.',
    ],
    'microsoft_clarity' => [
        'description' => 'Microsoft Clarity es un servicio de análisis que nos permite recopilar datos sobre el uso de nuestro sitio web para mejorar su funcionamiento. Microsoft puede recopilar información como clics, movimientos del ratón, páginas visitadas y otros datos de comportamiento.',
        'cookies' => [
            '_clck' => 'Conserva el ID de usuario de Clarity y las preferencias, único para este sitio y atribuido al mismo ID de usuario.',
            '_clsk' => 'Conecta varias páginas vistas por un usuario en una sola grabación de sesión de Clarity.',
            'CLID' => 'Identifica la primera vez que Clarity vio a este usuario en cualquier sitio que utilice Clarity.',
        ],
    ],
    'paypal' => [
        'description' => 'PayPal es un servicio de pago que nos permite aceptar pagos de nuestros clientes. PayPal puede recopilar información personal como nombres, direcciones de correo electrónico e información de facturación.',
    ],
    'posthog_analytics' => [
        'description' => 'PostHog Analytics es un servicio de estadísticas que nos permite recopilar datos sobre el uso de nuestro sitio web para mejorar su funcionamiento. PostHog puede recopilar información personal como nombres, direcciones de correo electrónico y datos de navegación.',
        'cookies' => [
            'ph_phc_*' => 'Se utiliza para obtener información sobre el comportamiento del usuario',
        ],
    ],
    'scalapay' => [
        'description' => 'Scalapay es un servicio de pago que nos permite aceptar pagos a plazos de nuestros clientes. Scalapay puede recopilar información personal como nombres, direcciones de correo electrónico e información de facturación para evaluar la idoneidad del usuario para sus métodos de pago y personalizar esos métodos de pago.',
    ],
    'stripe' => [
        'description' => 'Stripe es un servicio de pago que nos permite aceptar pagos de nuestros clientes. Stripe puede recopilar información personal como nombres, direcciones de correo electrónico e información de facturación.',
    ],
    'zoho_campaigns' => [
        'description' => 'Zoho Campaigns es un servicio de automatización de marketing que nos permite enviar correos electrónicos a nuestros clientes. Zoho Campaigns puede recopilar información personal como nombres, direcciones de correo electrónico y datos de navegación.',
    ],
];
