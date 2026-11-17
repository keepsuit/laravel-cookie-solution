<?php

return [
    'amazon_web_services' => [
        'description' => 'Amazon Web Services (AWS) es un servicio de alojamiento que nos permite almacenar y procesar datos de manera segura y confiable. Los datos almacenados en AWS pueden incluir información personal como nombres, direcciones de correo electrónico y datos de navegación. Amazon puede usar los datos de acuerdo con su propia política de privacidad, que se puede encontrar en el sitio web de Amazon Web Services. Tomamos medidas razonables para garantizar que los datos almacenados en AWS estén protegidos y sean seguros, pero no podemos garantizar la seguridad absoluta de los datos almacenados en servidores de terceros.',
    ],
    'digital_ocean' => [
        'description' => 'DigitalOcean es un servicio de alojamiento que nos permite almacenar y procesar datos de manera segura y confiable. Los datos almacenados en DigitalOcean pueden incluir información personal como nombres, direcciones de correo electrónico y datos de navegación. DigitalOcean puede usar los datos de acuerdo con su propia política de privacidad, que se puede encontrar en el sitio web de DigitalOcean.',
    ],
    'facebook_pixel' => [
        'description' => 'Meta Pixel utiliza cookies para recopilar datos sobre los visitantes del sitio web. Meta puede usar los datos recopilados para mostrar anuncios a los visitantes del sitio web y comprender la efectividad de las campañas publicitarias de Meta. Puedes obtener más información sobre Meta Pixel y cómo optar por no participar en la recopilación de datos visitando el sitio web de Meta.',
        'cookies' => [
            '_fbp' => 'Se utiliza para almacenar y rastrear visitas en varios sitios web.',
            '_fbc' => 'Se utiliza para almacenar el identificador del clic en el anuncio y atribuir conversiones.',
            'fr' => 'Se utiliza para proporcionar entrega de anuncios o retargeting.',
        ],
    ],
    'google_ads_remarketing' => [
        'description' => 'Google Ads Remarketing es un servicio que nos permite mostrar anuncios a usuarios que han visitado previamente nuestro sitio web. Google Ads Remarketing utiliza cookies para recopilar datos sobre los visitantes del sitio web. Google puede usar los datos recopilados para mostrar anuncios a los visitantes del sitio web y comprender la efectividad de las campañas publicitarias de Google. Puedes obtener más información sobre Google Ads Remarketing y cómo optar por no participar en la recopilación de datos visitando el sitio web de Google Ads.',
        'cookies' => [
            '_generic' => 'Se utiliza para proporcionar entrega de anuncios o retargeting',
            '_conversion' => 'Se utiliza para almacenar información sobre los clics en anuncios y atribuir conversiones',
            'NID' => 'Se utiliza para proporcionar entrega de anuncios o retargeting y almacenar preferencias de usuario',
        ],
    ],
    'google_analytics_4' => [
        'description' => 'Google Analytics es un servicio de estadísticas que utiliza cookies para recopilar datos sobre los visitantes del sitio web. Google puede usar los datos recopilados para contextualizar y personalizar los anuncios de su red publicitaria. Puedes obtener más información sobre Google Analytics y cómo optar por no participar en la recopilación de datos visitando el sitio web de Google Analytics.',
        'cookies' => [
            '_ga' => 'Se utiliza para distinguir usuarios.',
            '_ga_*' => 'Se utiliza para mantener el estado de la sesión.',
        ],
    ],
    'google_maps' => [
        'description' => 'Google Maps es un servicio de mapas que nos permite mostrar mapas interactivos en nuestro sitio web. Al cargar un mapa, Google recibe la dirección IP del visitante y puede instalar cookies que también utiliza para mostrar anuncios a los usuarios que no han iniciado sesión.',
        'cookies' => [
            'NID' => 'Guarda preferencias y otra información, y Google puede utilizarla para mostrar anuncios a los usuarios que no han iniciado sesión.',
        ],
    ],
    'google_recaptcha' => [
        'description' => 'Google reCAPTCHA es un servicio de seguridad que protege nuestros formularios del spam y los abusos analizando cómo interactúan los visitantes con la página. Google trata los datos recogidos solo para prestar y proteger el servicio.',
        'cookies' => [
            '_GRECAPTCHA' => 'Se utiliza para el análisis de riesgo que distingue a las personas de los bots.',
        ],
    ],
    'google_tag_manager' => [
        'description' => 'Google Tag Manager es un servicio que permite agregar y administrar varias etiquetas de marketing y análisis a través de una sola interfaz. Google Tag Manager no recopila ninguna información personal, pero puede enviar datos a otros servicios como Google Analytics, Google Ads y otros. Puedes obtener más información sobre Google Tag Manager y sus prácticas de datos visitando el sitio web de Google Tag Manager.',
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
            'MUID' => 'Identifica de forma única los navegadores que visitan sitios de Microsoft.',
            'MR' => 'Indica si se debe actualizar la cookie MUID.',
            'ANONCHK' => 'Indica si la cookie MUID se transfiere a la cookie publicitaria ANID. Clarity no utiliza ANID, por lo que su valor es siempre 0.',
            'SM' => 'Se utiliza para sincronizar la cookie MUID entre los dominios de Microsoft.',
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
    'vimeo' => [
        'description' => 'Vimeo es un servicio de alojamiento de vídeos que nos permite mostrar vídeos en nuestro sitio web. Al cargar un vídeo, Vimeo recibe la dirección IP del visitante y puede instalar cookies para proteger el reproductor, recordar sus preferencias y recoger estadísticas de reproducción para el propietario del vídeo.',
        'cookies' => [
            'player_clearance' => 'Se utiliza para proteger el reproductor de los bots.',
            'cf_clearance' => 'Instalada por Cloudflare para proteger el reproductor de los bots.',
            '__cf_bm' => 'Instalada por Cloudflare para reconocer el tráfico de bots.',
            '_cfuvid' => 'Instalada por Cloudflare para aplicar los límites de frecuencia de las solicitudes.',
            'vuid' => 'Identifica al visitante para generar estadísticas de reproducción para el propietario del vídeo.',
            'player' => 'Guarda las preferencias del reproductor, como el volumen, la calidad y los subtítulos.',
            'flags' => 'Guarda las funciones del reproductor activadas por el propietario del vídeo.',
        ],
    ],
    'youtube' => [
        'description' => 'YouTube es un servicio de alojamiento de vídeos que nos permite mostrar vídeos en nuestro sitio web. Al cargar un vídeo, Google recibe la dirección IP del visitante y, al reproducirlo, puede instalar cookies y guardar datos en el navegador para proteger el reproductor, recordar preferencias, medir el uso y personalizar los anuncios.',
        'cookies' => [
            'YSC' => 'Garantiza que las solicitudes de una sesión de navegación las realiza el usuario.',
            '__Secure-YEC' => 'Se utiliza para detectar spam, fraude y abusos.',
            'PREF' => 'Guarda preferencias como la configuración del reproductor.',
            '__Secure-ROLLOUT_TOKEN' => 'Se utiliza para lanzar nuevas funciones y medir su impacto.',
            '__Secure-YNID' => 'Se utiliza para estadísticas y, según la configuración de anuncios, para publicidad.',
            'VISITOR_INFO1_LIVE' => 'Se utiliza para estadísticas, recomendaciones personalizadas y, según la configuración de anuncios, para publicidad.',
        ],
    ],
    'zoho_campaigns' => [
        'description' => 'Zoho Campaigns es un servicio de automatización de marketing que nos permite enviar correos electrónicos a nuestros clientes. Zoho Campaigns puede recopilar información personal como nombres, direcciones de correo electrónico y datos de navegación.',
    ],
];
