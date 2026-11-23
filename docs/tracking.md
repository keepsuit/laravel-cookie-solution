# Connecting tracking services

The banner only stores the user's choice: each tracking service must be configured to wait for consent.
The status has one boolean for each purpose: `necessary`, `preferences`, `statistics`, `marketing`.

## Scripts that wait for consent

Any other snippet (a third-party pixel, a chat widget, a tag pasted in a layout) can wait for consent without code: make it inert with `type="text/plain"` and list its purposes, separated by spaces.

```html
<script type="text/plain" data-cookie-solution-purposes="statistics">
    // runs once statistics is granted
</script>
<script type="text/plain" data-cookie-solution-purposes="statistics marketing" data-src="https://example.com/pixel.js"></script>
<script type="text/plain" data-cookie-solution-purposes="marketing" data-type="module" data-src="https://example.com/widget.js"></script>
```

- On the status in effect at page load (the saved consent, or only `necessary`) and on every change, each script whose purposes are **all** granted is replaced by an executable copy: `data-src` becomes `src`, `data-type` becomes `type`, the other attributes (`nonce` included) are kept.
- Each script runs at most once per page, in document order: a script waits for the external one before it to load (or fail), as with the HTML parser.
- Scripts added later (e.g. by a client-side navigation) run as soon as they are added, if their purposes are granted.
- Revoking consent can't stop a script that already ran: the page must be reloaded.
- An unknown purpose or an empty list never runs, and logs a warning in the console.
- They need the banner: with the package disabled (`enabled` false) they never run.

## Embeds that wait for consent

Embedded videos and maps (YouTube, Vimeo, Google Maps…) set cookies as soon as the iframe loads. Move their `src` to `data-src` and list their purposes:

```html
<iframe
    data-cookie-solution-purposes="marketing"
    data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    width="560"
    height="315"
    allowfullscreen
></iframe>
```

- While its purposes are not **all** granted, the iframe is hidden and a `<cookie-solution-embed-placeholder>` is shown after it, in the same box (the iframe `class`, `style`, `width` and `height`). It names the purposes and has a button that grants them: every iframe and inert script waiting for them loads, the other choices are kept, and an open banner closes.
- Once granted, `data-src` becomes `src`. If the consent is later revoked, the iframe is unloaded (`src` becomes `about:blank`) and the placeholder comes back.
- Iframes added later (e.g. by a client-side navigation) are handled as soon as they are added.
- An unknown purpose or an empty list never loads, and logs a warning in the console.
- They need the banner: with the package disabled (`enabled` false) they never load and no placeholder is shown.
- The placeholder follows the banner `color_scheme` and `highlight_color`; style it with the `embed-placeholder-root`, `embed-placeholder-message` and `embed-placeholder-button` parts. Its texts are in the `embed` group of the translations.

### Embed services

Register the service of each embed, so its cookies are listed in the banner and in the cookie policy, and make its iframe wait for the suggested purposes:

| Service | Factory | `data-cookie-solution-purposes` |
| --- | --- | --- |
| YouTube | `YouTubeServiceFactory` (`Google`) | `marketing`: Google uses its cookies also for advertising. Prefer `youtube-nocookie.com`: it sets cookies only on play, but still needs consent. |
| Google Maps | `GoogleMapsServiceFactory` (`Google`) | `marketing`: Google uses `NID` also to show ads to signed-out users. |
| Vimeo | `VimeoServiceFactory` (`Vimeo`) | `statistics`. With `->doNotTrack()`, for player URLs with `dnt=1`, Vimeo sets only the cookies that secure the player, listed as `necessary`: whether the iframe may then load without consent is the site's assessment. |
| Google reCAPTCHA | `GoogleRecaptchaServiceFactory` (`Google`) | Not an iframe: load its script as is. `_GRECAPTCHA` is listed as `necessary`, as Google classifies it; since April 2026 Google processes reCAPTCHA data only to provide the service. The CNIL still names reCAPTCHA among captchas that need consent: for that reading use `->build()->withCookiePurposes(CookiePurpose::MARKETING)` and an [inert script](#scripts-that-wait-for-consent). Loading it from `www.recaptcha.net` avoids the other `google.com` cookies. |

```php
use Keepsuit\CookieSolution\ServiceFactories\Google\GoogleEntity;
use Keepsuit\CookieSolution\ServiceFactories\Google\YouTubeServiceFactory;
use Keepsuit\CookieSolution\ServiceFactories\Vimeo\VimeoServiceFactory;

$cookieSolution
    ->register(YouTubeServiceFactory::new()->entity(GoogleEntity::IRELAND)->build())
    ->register(VimeoServiceFactory::new()->doNotTrack()->build());
```

For YouTube and Google Maps embeds Google is the controller for the visitor's country: `GoogleEntity::IRELAND` (Google Ireland Limited) serves EEA and Swiss visitors, `USA` (Google LLC) the others. Since April 2026 reCAPTCHA is provided under the Google Cloud terms: its `->entity()` takes a `GoogleCloudEntity`, by the site's billing address.

The cookies are set by the provider's domain: the banner lists them but cannot delete them when consent is revoked.

Any service, built by a factory or by hand, can change the purpose of its cookies: `withCookiePurposes(CookiePurpose::MARKETING)` sets it for every cookie, `withCookiePurposes(['PREF' => CookiePurpose::MARKETING])` only for the named ones (an unknown name throws).

## Google Tag Manager / Google Analytics (consent mode)

Consent mode requires a default state **before** the GTM/gtag script is loaded.

With Blade, include this view in `<head>` before GTM:

```blade
@include('cookie-solution::google-consent-mode')
```

It sets the default from the consent stored in the browser (the page HTML is the same for every visitor, so full-page caches are safe), updates it when the user changes it, and pushes a `cookie-solution-status-change` event to `dataLayer` (usable as a GTM trigger).

Options, under `google_consent_mode` in the config:

| Option | Default | Effect |
| --- | --- | --- |
| `wait_for_update` | `500` | Milliseconds Google tags wait for a consent update before firing. |
| `url_passthrough` | `false` | Renders `gtag('set', 'url_passthrough', true)`: with ad storage denied, ad click information is kept in page URLs. |
| `ads_data_redaction` | `false` | Renders `gtag('set', 'ads_data_redaction', true)`: with ad storage denied, ad click identifiers are redacted. |

In a headless frontend render the saved status reader and the same script in the server-side `<head>`.
It restores the stored consent only if it was given for the current configuration (same `digest`): when you change the services, the banner asks again and Google must not keep the old consent.

```tsx
import { savedStatusScript } from '@keepsuit/cookie-solution';

<script dangerouslySetInnerHTML={{ __html: savedStatusScript(config) }} />
```

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

    gtag('consent', 'default', {
        ...cookieSolutionConsent(window.cookieSolutionSavedStatus?.()?.purposes ?? {}),
        wait_for_update: 500,
    });
    // Optional, see the options above:
    // gtag('set', 'url_passthrough', true);
    // gtag('set', 'ads_data_redaction', true);
</script>
```

Then update it on every change (the default is already set):

```js
document.addEventListener('cookie-solution-status-change', (event) => {
    gtag('consent', 'update', cookieSolutionConsent(event.detail.purposes));
    dataLayer.push({ event: 'cookie-solution-status-change', status: event.detail.purposes });
});
```

## Meta Pixel

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

Since October 31, 2025 Clarity requires a consent signal for visits from the EEA, the UK and Switzerland: without `Clarity.consent()` those visits are not fully tracked.

```js
import Clarity from '@microsoft/clarity';

Clarity.init('YOUR_PROJECT_ID');
Clarity.consent(false);

onStatusChange((status) => Clarity.consent(status.purposes.statistics));
```

In Blade pages use `window.CookieSolution.onStatusChange` (after the banner script has loaded) or listen to the `cookie-solution-status-default` and `cookie-solution-status-change` events (see [Headless frontends](headless.md)).
