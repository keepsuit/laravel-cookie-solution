# Connecting tracking services

The banner only stores the user's choice: each tracking service must be configured to wait for consent.
The status has one boolean for each purpose: `necessary`, `preferences`, `statistics`, `marketing`.

## Google Tag Manager / Google Analytics (consent mode)

Consent mode requires a default state **before** the GTM/gtag script is loaded.

With Blade, include this view in `<head>` before GTM:

```blade
@include('cookie-solution::google-consent-mode')
```

It sets the default from the consent stored in the browser (the page HTML is the same for every visitor, so full-page caches are safe), updates it when the user changes it, and pushes a `cookie-solution-status-change` event to `dataLayer` (usable as a GTM trigger).

In a headless frontend render the same script in the server-side `<head>`, with `cookie_name` and `digest` from the config endpoint.
It restores the stored consent only if it was given for the current configuration (same `digest`): when you change the services, the banner asks again and Google must not keep the old consent.

```html
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }

    function cookieSolutionConsent(purposes) {
        const state = (granted) => (granted ? 'granted' : 'denied');
        return {
            analytics_storage: state(purposes.statistics),
            ad_storage: state(purposes.marketing),
            ad_user_data: state(purposes.marketing),
            ad_personalization: state(purposes.marketing),
            personalization_storage: state(purposes.preferences),
            functionality_storage: 'granted',
            security_storage: 'granted',
        };
    }

    (function () {
        const config = { cookie_name: 'COOKIE_NAME', digest: 'DIGEST' };
        let purposes = {};
        try {
            const value = document.cookie
                .split('; ')
                .find((cookie) => cookie.startsWith(config.cookie_name + '='));
            const status = value && JSON.parse(decodeURIComponent(value.split('=')[1]));
            if (status && status.digest === config.digest) {
                purposes = status.purposes;
            }
        } catch (e) {}
        gtag('consent', 'default', { ...cookieSolutionConsent(purposes), wait_for_update: 500 });
    })();
</script>
```

Then update it on every change (the default is already set):

```js
document.addEventListener('cookie-solution-status-change', (event) => {
    gtag('consent', 'update', cookieSolutionConsent(event.detail.purposes));
    dataLayer.push({ event: 'cookie-solution-status-change', status: event.detail.purposes });
});
```

## Facebook Pixel

Revoke consent before `fbq('init', ...)`, then follow the user's choice:

```js
fbq('consent', 'revoke');
fbq('init', 'YOUR_PIXEL_ID');

onStatusChange((status) => fbq('consent', status.purposes.marketing ? 'grant' : 'revoke'));
```

## PostHog

Start without persistent storage and enable it after consent:

```js
posthog.init('YOUR_TOKEN', { persistence: 'memory' });

onStatusChange((status) => {
    posthog.set_config({ persistence: status.purposes.statistics ? 'localStorage+cookie' : 'memory' });
});
```

## Microsoft Clarity

```js
import Clarity from '@microsoft/clarity';

Clarity.init('YOUR_PROJECT_ID');
Clarity.consent(false);

onStatusChange((status) => Clarity.consent(status.purposes.statistics));
```

In Blade pages use `window.CookieSolution.onStatusChange` (after the banner script has loaded) or listen to the `cookie-solution-status-default` and `cookie-solution-status-change` events (see [Headless frontends](headless.md)).
