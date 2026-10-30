# Changelog

All notable changes to `laravel-cookie-solution` will be documented in this file.

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
