# Changelog

All notable changes to `laravel-cookie-solution` will be documented in this file.

## 2.4.0 - 2026-11-03

#### Highlights

- **Consent across subdomains**: `cookie_domain` (env `COOKIE_SOLUTION_COOKIE_DOMAIN`, e.g. `.example.com`) writes the consent cookie on that domain, so `www.example.com` and `shop.example.com` ask only once. Use `env('SESSION_DOMAIN')` to follow the session cookie. The subdomains must register the same services, or each one asks again, and the domain must cover the current host. Default `null` keeps the cookie on the current host: nothing changes until it is set. When a host-only and a domain cookie coexist (e.g. right after setting the domain), the banner, `window.cookieSolutionSavedStatus()` and `CookieSolution::status()` read the newest one, so a later choice made on another subdomain is not masked by an older one.
- **Default policy texts**: `CookieSolution::defaultPolicyText($policy, $locale)` returns the policy file for a locale (published or from the package, `null` when it has none), ignoring `resolvePolicyTextUsing()`: e.g. the starting point of a text edited in the app. See [Policy texts](https://github.com/keepsuit/laravel-cookie-solution#policy-texts).

### What's Changed

* Take the npm version from the release tag by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/57
* Expose the policy file of a locale by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/58
* Make the consent cookie domain configurable by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/59

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/2.3.0...2.4.0

## 2.3.0 - 2026-11-03

#### Highlights

- **HTML data owner**: `data_owner.name_and_address` accepts an `Htmlable` (e.g. `HtmlString`), rendered as is. HTML from a rich text editor can be used directly, without converting it to Markdown. Objects can't be cached by `config:cache`, so set it at runtime: `config()->set('cookie-solution.data_owner.name_and_address', new HtmlString($html))`. String values are still parsed as Markdown with HTML escaped.
- **Policy texts from the app**: `resolvePolicyTextUsing(fn (Policy $policy, string $locale) => ...)` provides the cookie and privacy policy texts before the Markdown files, e.g. per site and locale from a CMS. Return a Markdown string (rendered like the files), an `Htmlable` (printed as is, not sanitized; an empty one hides the text), or `null` to fall back to the files. Used by the policy views, `GET {path}/policies` and the banner. See [Policy texts](https://github.com/keepsuit/laravel-cookie-solution#policy-texts).
- **Scoped instance**: `CookieSolution` is bound as a scoped instance instead of a singleton, so consent, banner content and services no longer leak across requests and jobs on Octane and queue workers. Register services and resolvers in an `afterResolving` callback, not on the instance during `boot()`: see [UPGRADING.md](https://github.com/keepsuit/laravel-cookie-solution/blob/main/UPGRADING.md#from-22-to-23). Nothing changes on PHP-FPM.
- **Saved consent in `<head>`**: `window.cookieSolutionSavedStatus()` returns the consent saved for the current configuration (or `undefined`) synchronously, before the deferred script loads, e.g. to set a tracker's default state. It is defined by `cookie-solution::script` and `cookie-solution::google-consent-mode`, or alone with `@include('cookie-solution::status')`; headless frontends render `savedStatusScript(config)` from `@keepsuit/cookie-solution` in the server-side `<head>`. Read in the browser, so full-page caches stay safe. `google-consent-mode` now uses it instead of its own cookie reader. See [saved consent in `<head>`](https://github.com/keepsuit/laravel-cookie-solution/blob/main/docs/headless.md#saved-consent-in-head).
- **Scripts that wait for consent**: `<script type="text/plain" data-cookie-solution-purposes="statistics marketing">` (inline, or empty with `data-src`; `data-type="module"` for modules) runs once all its purposes are granted, at most once per page and in document order, including scripts added later by client-side navigation. Useful for pixels, chat widgets and tags without a consent API. An unknown purpose never runs and logs a warning; revoking consent needs a reload. See [Scripts that wait for consent](https://github.com/keepsuit/laravel-cookie-solution/blob/main/docs/tracking.md#scripts-that-wait-for-consent).

### What's Changed

* Render an Htmlable data owner name and address as is by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/45
* Resolve the policy texts from the app by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/54
* Expose the saved consent synchronously in the head by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/55
* Run inert scripts once their purposes are granted by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/56

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/2.2.1...2.3.0

## 2.2.1 - 2026-11-02

### What's Changed

* Escape HTML in the data owner Markdown by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/44

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/2.2.0...2.2.1

## 2.2.0 - 2026-11-02

### Highlights

- **Dark color scheme**: the new `color_scheme` config value sets the colors of the banner and the policy views: `'light'` (default), `'dark'` or `'auto'` (follows the visitor's `prefers-color-scheme`). Unknown values fall back to `'light'`. With `'dark'` and `'auto'` the policy views have light text and expect a dark page background. See [docs/customization.md](https://github.com/keepsuit/laravel-cookie-solution/blob/2.2.0/docs/customization.md#color-scheme).
- **Readable highlight color in dark mode**: where it is used for text, focus rings or icons, the highlight color is lightened to stay readable on the dark background. Browsers without CSS relative colors mix it with white instead.
- **Theme color variables**: `--cs--color-background`, `--cs--color-surface`, `--cs--color-text`, `--cs--color-text-muted` and `--cs--color-border` adjust the colors in every scheme, nested components included.
- **Formatter attributes**: `<cookie-solution-policy-formatter>` accepts `color-scheme` and `highlight-color` attributes. `CookieSolution::colorScheme()` returns the configured scheme.

### Changes for headless frontends

- `CookieSolutionConfig` has a new optional `color_scheme` field. Override it before mounting to follow the site's own theme switch: `mount({ ...config, color_scheme: theme })`.
- The formatter doesn't read the config: pass `color_scheme` and `highlight_color` as its `color-scheme` and `highlight-color` attributes, as [docs/headless.md](https://github.com/keepsuit/laravel-cookie-solution/blob/2.2.0/docs/headless.md) shows. Setting `--cs--color-highlight` on it keeps working.
- Bundle: 81.3 → 84.6 KB (gzip 20.5 → 21.0 KB).

### Service updates

Checked against the vendors' current documentation:

- **Google Ads Remarketing**: drops the cookies Google no longer lists (`1P_JAR`, `DV`, `CONSENT`, `APISID`, `SSID`, `HSID`, `SID`, `OGPC`) and adds the conversion cookies `_gcl_au`, `_gcl_gs`, `_gcl_ag` and `_gcl_gb`. `__gads` and `IDE` now last 13 months.
- **Meta Pixel**: `FacebookPixelServiceFactory` shows the service as "Meta Pixel", adds the `_fbc` cookie and links Meta's current privacy policy.
- **Microsoft Clarity**: adds the `MUID`, `MR`, `ANONCHK` and `SM` cookies.
- **PayPal and Stripe**: new `location()` option with the European entities, `PayPalDataProcessingLocation::LUXEMBOURG` and `StripeDataProcessingLocation::IRELAND`.
- **Scalapay**: the provider is Scalapay IP S.p.A. (Italy), the payment institution, with its privacy policy.
- **Zoho Campaigns**: fixes the privacy policy link, shows the provider of the selected data center and adds Canada, China, Japan, Saudi Arabia, Singapore and UAE.
- **Amazon Web Services**: adds 11 regions (Hong Kong, Indonesia, Israel, Malaysia, Mexico, New Zealand, Spain, Switzerland, Taiwan, Thailand, UAE).
- **Location names**: misspelled cases are renamed (`SINGAPORE`, `SWEDEN`, `NETHERLANDS`); the old names keep working as deprecated aliases.

### Upgrading

Nothing changes with the default `'light'` scheme. Policy views published from earlier versions don't set `color-scheme`: publish them again, or add the attribute to the formatter. Sites using Google Ads Remarketing, Meta Pixel or Microsoft Clarity ask visitors for consent again, because their cookie lists changed. PayPal and Stripe now report `USA` by default: pass the European location for EEA visitors. See [UPGRADING.md](https://github.com/keepsuit/laravel-cookie-solution/blob/2.2.0/UPGRADING.md).

## 2.1.0 - 2026-10-30

### Highlights

- **One policy markup**: the Blade policy views and `GET {path}/policies` now render the same HTML (`partials/cookie-policy.blade.php`, `partials/privacy-policy.blade.php`). Headless frontends can wrap it in `<cookie-solution-policy-formatter>` and get the default styles, as [docs/headless.md](https://github.com/keepsuit/laravel-cookie-solution/blob/2.1.0/docs/headless.md) describes.
- **Styling through parts**: the policy markup has no utility classes; the default styles target the `part` attributes. Without the formatter, the same parts work as attribute selectors (`[part~='service']`).
- **Semantic policy markup**: services as lists (`role="list"`), cookies as description lists, a heading per service.
- **Smaller bundle**: `@tailwindcss/typography` is replaced by the few rules the policies need (92.2 → 81.3 KB, gzip 22.0 → 20.5 KB). The rendering of the policy views and of the banner information tab is unchanged.

### Changes for headless frontends

- `GET {path}/policies` returns a different structure, with `part` attributes: check any CSS or parsing of that HTML.
- New part `service-title` in the privacy policy.

### Upgrading

Policy views published from 2.0.0 keep working, with small spacing differences; publish them again to get the shared markup. See [UPGRADING.md](https://github.com/keepsuit/laravel-cookie-solution/blob/2.1.0/UPGRADING.md).

## 2.0.0 - 2026-10-30

### Highlights

- **Headless frontends**: the banner can be mounted from any frontend (React, SSR, SPA) with the new npm package [`@keepsuit/cookie-solution`](https://www.npmjs.com/package/@keepsuit/cookie-solution) (`mount`, `open`, `getStatus`, `onStatusChange`). Laravel serves the configuration through public JSON endpoints under `cookie-solution`. See [docs/headless.md](https://github.com/keepsuit/laravel-cookie-solution/blob/2.0.0/docs/headless.md).
- **Lighter pages**: every page gets only a small boot config; texts, services and the cookie policy are loaded when the banner opens. Both are the same for every visitor, so pages can be cached.
- **New design** with two layouts: `modal` (default) and `floating` (corner card, the page stays usable). The highlight color now drives readable derived colors automatically.
- **Accessibility**: native `<dialog>`, WAI-ARIA tabs, labelled controls, keyboard-only focus ring, reduced motion.
- **Status events**: `cookie-solution-status-default` (once per page) and `cookie-solution-status-change`.
- **Policies**: restyled policy views, unstyled HTML for headless apps, revised default legal texts (no implicit consent).

### Breaking changes

- Laravel 12 or 13 required.
- The `integrations` config (gtag / fbq) is removed: add `@include('cookie-solution::google-consent-mode')` before Google Tag Manager; other services are covered in [docs/tracking.md](https://github.com/keepsuit/laravel-cookie-solution/blob/2.0.0/docs/tracking.md).
- Published views, translations and markdown policies must be republished or merged; a published 1.x `script.blade.php` fails.
- `window._cookieSolution` and `CookieSolution::getConfig()` contain only the boot configuration. Stored consents remain valid.

### From the 2.0 betas

- The API endpoints moved from `api/cookie-solution` to `cookie-solution`, so Laravel's default CORS config (`api/*`) no longer applies to them. If you published the config during the beta, update `api.path` or set `COOKIE_SOLUTION_API_PATH`.

### Upgrading

Follow the upgrade guide: [UPGRADING.md](https://github.com/keepsuit/laravel-cookie-solution/blob/2.0.0/UPGRADING.md)

```sh
composer require keepsuit/laravel-cookie-solution:^2.0
npm i @keepsuit/cookie-solution   # headless frontends only





```
**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.6.2...2.0.0

## 1.6.2 - 2026-10-28

### What's Changed

* Bump actions/checkout from 6 to 7 by @dependabot[bot] in https://github.com/keepsuit/laravel-cookie-solution/pull/38
* Fix status() rejecting timestamps written by the banner by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/40

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.6.1...1.6.2

## v1.6.1 - 2026-04-23

### What's Changed

* Bump ramsey/composer-install from 3 to 4 by @dependabot[bot] in https://github.com/keepsuit/laravel-cookie-solution/pull/35
* Bump dependabot/fetch-metadata from 2.5.0 to 3.0.0 by @dependabot[bot] in https://github.com/keepsuit/laravel-cookie-solution/pull/36
* Bump dependabot/fetch-metadata from 3.0.0 to 3.1.0 by @dependabot[bot] in https://github.com/keepsuit/laravel-cookie-solution/pull/37
* Ensure decoded data is an array before validation

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.6.0...1.6.1

## v1.6.0 - 2026-03-05

### What's Changed

* Bump dependabot/fetch-metadata from 2.4.0 to 2.5.0 by @dependabot[bot] in https://github.com/keepsuit/laravel-cookie-solution/pull/33
* drop php 8.1 & laravel 10, support php 8.5 & laravel 13 by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/34
* update frontend dependencies

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.5.1...1.6.0

## v1.5.1 - 2025-11-26

### What's changed

* Added `part` tag to root element

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.5.0...1.5.1

## v1.5.0 - 2025-11-26

### What's Changed

* Bump actions/checkout from 4 to 5 by @dependabot[bot] in https://github.com/keepsuit/laravel-cookie-solution/pull/29
* Bump stefanzweifel/git-auto-commit-action from 6 to 7 by @dependabot[bot] in https://github.com/keepsuit/laravel-cookie-solution/pull/30
* Bump actions/checkout from 5 to 6 by @dependabot[bot] in https://github.com/keepsuit/laravel-cookie-solution/pull/31
* Policy formatter customization by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/32

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.4.0...1.5.0

## 1.4.0 - 2025-08-06

### What's Changed

* Bump aglipanci/laravel-pint-action from 2.5 to 2.6 by @dependabot[bot] in https://github.com/keepsuit/laravel-cookie-solution/pull/27
* cache compiled markdown by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/28

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.3.0...1.4.0

## v1.3.0 - 2025-07-02

### What's Changed

* microsoft clarity service by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/26

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.2.1...1.3.0

## 1.2.1 - 2025-06-27

### What's Changed

* Don't emit status changed event when status is undefined
* Bump stefanzweifel/git-auto-commit-action from 5 to 6 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/25

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.2.0...1.2.1

## v1.2.0 - 2025-05-29

### What's Changed

* load script as module by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/22
* don't add cookie solution banner if already present in the dom by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/23
* Custom toggle by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/24

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.1.1...1.2.0

## v1.1.1 - 2025-05-21

### What's changed

* Allow to customize toggle `z-index`

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.1.0...1.1.1

## v1.1.0 - 2025-05-19

### What's Changed

* Use same style for all buttons
* Added posthog analytics service
* Bump dependabot/fetch-metadata from 2.3.0 to 2.4.0 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/21

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.0.1...1.1.0

## v1.0.1 - 2025-04-14

### What's Changed

* Improved cookie validation by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/20

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/1.0.0...1.0.1

## v1.0.0 - 2025-02-23

### What's Changed

* drop laravel 9
* support laravel 12
* Bump dependabot/fetch-metadata from 2.2.0 to 2.3.0 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/18
* Bump aglipanci/laravel-pint-action from 2.4 to 2.5 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/19

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.5.1...1.0.0

## v0.5.1 - 2024-07-24

### What's Changed

* Bump ramsey/composer-install from 2 to 3 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/13
* Bump dependabot/fetch-metadata from 1.6.0 to 2.0.0 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/14
* Bump aglipanci/laravel-pint-action from 2.3.1 to 2.4 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/15
* Bump dependabot/fetch-metadata from 2.0.0 to 2.1.0 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/16
* Bump dependabot/fetch-metadata from 2.1.0 to 2.2.0 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/17
* Fix initial style by @cappuc

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.5.0...0.5.1

## v0.5.0 - 2024-02-22

### What's Changed

* Load status server side by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/11
* Support laravel 11 & php 8.3 by @cappuc in https://github.com/keepsuit/laravel-cookie-solution/pull/12

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.4.1...0.5.0

## v0.4.1 - 2024-02-21

### What's changed

- Added support for `gtag` new consent types: `ad_user_data` and `ad_personalization`, enabled with `marketing` purpose.

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.4.0...0.4.1

## v0.4.0 - 2024-02-06

### What's Changed

* Upgraded `lit` to v3
* Added Spanish and German translations
* Bump aglipanci/laravel-pint-action from 2.3.0 to 2.3.1 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/10

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.3.7...0.4.0

## v0.3.7 - 2023-11-30

### What's Changed

* Added `part` api to allow style override of some dom parts
* Hidden by default cookie toggle and banner when printing
* Fixed dialog missing title (accessibility)

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.3.6...0.3.7

## v0.3.6 - 2023-10-09

### What's Changed

- Improved accessibility
- Bump stefanzweifel/git-auto-commit-action from 4 to 5 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/9

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.3.5...0.3.6

## v0.3.5 - 2023-09-28

### What's changed

- Added French translations

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.3.4...0.3.5

## v0.3.4 - 2023-09-28

### What's Changed

- Fixed header selection bar
- Bump actions/checkout from 3 to 4 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/8

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.3.3...0.3.4

## v0.3.3 - 2023-07-17

### What's Changed

- Allow to disable integrations with third party services (google tag manager/facebook pixel)
- Bump dependabot/fetch-metadata from 1.5.1 to 1.6.0 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/7

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.3.2...0.3.3

## v0.3.2 - 2023-05-31

### What's Changed

- Improved integration with Google Tag Manager and Facebook Pixel
- Bump dependabot/fetch-metadata from 1.4.0 to 1.5.1 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/5
- Bump aglipanci/laravel-pint-action from 2.2.0 to 2.3.0 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/6

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.3.1...0.3.2

## v0.3.1 - 2023-05-26

### What's changed

- Added `Klarna` service
- Added `Scalapay` service

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.3.0...0.3.1

## v0.3.0 - 2023-05-09

### What's changed

- Build js as `iife` instead of `es` module to reduce the size.

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.2.4...0.3.0

## v0.2.4 - 2023-05-04

### What's changed

- Generate config digest ignoring translations strings

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.2.3...0.2.4

## v0.2.3 - 2023-05-03

### What's Changed

- Bump dependabot/fetch-metadata from 1.3.6 to 1.4.0 by @dependabot in https://github.com/keepsuit/laravel-cookie-solution/pull/4
- Fix cookie policy markdown
- updated dependencies

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.2.2...0.2.3

## v0.2.2 - 2023-04-22

### What's Changed

- Added `Stripe` service

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/v0.2.1...0.2.2

## v0.2.1 - 2023-03-21

### What's Changed

- Added `GoogleAdsRemarketing` service
- Added `Mailchimp` service
- Added `ZohoCampaigns` service
- Added `DigitalOcean` service

**Full Changelog**: https://github.com/keepsuit/laravel-cookie-solution/compare/0.2.0...v0.2.1

## v0.2.0 - 2023-03-17

- Added titles to `cookie-policy` and `privacy-policy` views
- Added `<cookie-solution-policy-formatter/>` custom components to policy views to apply default formatting (and not require the user to update his `tailwindcss` config or customize the view)

## v0.1.5 - 2023-03-01

- Allow to customize toggle position with css variables `--cs--toggle-position-bottom` and `--cs--toggle-position-x`

## v0.1.4 - 2023-02-28

- Added option to set toggle position (left or right)

## v0.1.3 - 2023-01-27

- Fix: removed `console.log`

## v0.1.2 - 2023-01-27

- Improved support for light highlight color

## v0.1.1 - 2023-01-27

- Fixed animation on customize tab rows
- Set default to denied for categories without cookies
- Fix toggle icon on safari
- Invalidate status when cookies config changes

## v0.1.0 - 2023-01-26

- First release
