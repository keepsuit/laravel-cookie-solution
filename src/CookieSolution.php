<?php

namespace Keepsuit\CookieSolution;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;
use Illuminate\Support\Stringable;

class CookieSolution
{
    /**
     * @var Service[]
     */
    protected array $services = [];

    private array $markdownConfig = [
        'html_input' => false,
        'allow_unsafe_links' => false,
    ];

    public function __construct(
        protected CookieSolutionAssets $assets,
    ) {
    }

    public function enabled(): bool
    {
        return config('cookie-solution.enabled', true);
    }

    /**
     * @return Collection<array-key,Service>
     */
    public function services(): Collection
    {
        return Collection::make($this->services);
    }

    public function hasCookies(): bool
    {
        return $this->services()
            ->reduce(fn (bool $hasCookies, Service $service) => $hasCookies || count($service->cookies) > 0, false);
    }

    public function hasServices(): bool
    {
        return $this->services()->isNotEmpty();
    }

    public function hasDataOwner(): bool
    {
        return config('cookie-solution.data_owner.name_and_address') !== null;
    }

    /**
     * @return Collection<string,Collection<array-key,Service>>
     */
    public function servicesGroupedByCookiePurpose(): Collection
    {
        return Collection::make([
            CookiePurpose::NECESSARY->value => $this->getCookiesConfigForPurpose(CookiePurpose::NECESSARY),
            CookiePurpose::PREFERENCES->value => $this->getCookiesConfigForPurpose(CookiePurpose::PREFERENCES),
            CookiePurpose::STATISTICS->value => $this->getCookiesConfigForPurpose(CookiePurpose::STATISTICS),
            CookiePurpose::MARKETING->value => $this->getCookiesConfigForPurpose(CookiePurpose::MARKETING),
        ]);
    }

    public function getConfig(): array
    {
        return [
            'digest' => $this->configDigest(),
            'cookie_name' => config('cookie-solution.cookie_name'),
            'cookie_lifetime' => config('cookie-solution.cookie_lifetime'),
            'toggle_position' => config('cookie-solution.toggle_position', 'right'),
            'texts' => [
                'tab_consent' => __('cookie-solution::texts.banner.tab_consent'),
                'tab_customize' => __('cookie-solution::texts.banner.tab_customize'),
                'tab_information' => __('cookie-solution::texts.banner.tab_information'),
                'button_accept_all' => __('cookie-solution::texts.banner.button_accept_all'),
                'button_accept_selected' => __('cookie-solution::texts.banner.button_accept_selected'),
                'button_refuse' => __('cookie-solution::texts.banner.button_refuse'),
                'button_customize' => __('cookie-solution::texts.banner.button_customize'),
                'consent_title' => __('cookie-solution::texts.banner.consent_title'),
                'consent_message' => __('cookie-solution::texts.banner.consent_message'),
                'customize_purpose_necessary' => __('cookie-solution::texts.cookie_policy.purpose_necessary'),
                'customize_purpose_necessary_description' => __('cookie-solution::texts.cookie_policy.purpose_necessary_description'),
                'customize_purpose_preferences' => __('cookie-solution::texts.cookie_policy.purpose_preferences'),
                'customize_purpose_preferences_description' => __('cookie-solution::texts.cookie_policy.purpose_preferences_description'),
                'customize_purpose_statistics' => __('cookie-solution::texts.cookie_policy.purpose_statistics'),
                'customize_purpose_statistics_description' => __('cookie-solution::texts.cookie_policy.purpose_statistics_description'),
                'customize_purpose_marketing' => __('cookie-solution::texts.cookie_policy.purpose_marketing'),
                'customize_purpose_marketing_description' => __('cookie-solution::texts.cookie_policy.purpose_marketing_description'),
                'information_text' => $this->cookiePolicyHtml()->toHtml(),
            ],
            'cookies' => $this->servicesGroupedByCookiePurpose()->toArray(),
        ];
    }

    public function register(Service $service): self
    {
        $this->services[] = $service;

        return $this;
    }

    /**
     * @return Collection<array-key,Service>
     */
    protected function getCookiesConfigForPurpose(CookiePurpose $cookiePurpose): Collection
    {
        return Collection::make($this->services)
            ->map(function (Service $service) use ($cookiePurpose) {
                $cookies = Collection::make($service->cookies)
                    ->filter(fn (Cookie $cookie) => $cookie->purpose === $cookiePurpose)
                    ->values()
                    ->all();

                return $service->cloneWithCookies($cookies);
            })
            ->filter(fn (Service $service) => count($service->cookies) > 0)
            ->values();
    }

    public function script(): HtmlString
    {
        return new HtmlString(view('cookie-solution::script')->render());
    }

    protected function cookiePolicyText(string $locale): ?string
    {
        if (File::exists(resource_path(sprintf('views/vendor/cookie-solution/policy/cookie-policy.%s.md', $locale)))) {
            return Str::markdown(File::get(resource_path(sprintf('views/vendor/cookie-solution/policy/cookie-policy.%s.md', $locale))), $this->markdownConfig);
        }

        if (File::exists(__DIR__.sprintf('/../resources/views/policy/cookie-policy.%s.md', $locale))) {
            return Str::markdown(File::get(__DIR__.sprintf('/../resources/views/policy/cookie-policy.%s.md', $locale)), $this->markdownConfig);
        }

        return null;
    }

    protected function privacyPolicyText(string $locale): ?string
    {
        if (File::exists(resource_path(sprintf('views/vendor/cookie-solution/policy/privacy-policy.%s.md', $locale)))) {
            return Str::markdown(File::get(resource_path(sprintf('views/vendor/cookie-solution/policy/privacy-policy.%s.md', $locale))), $this->markdownConfig);
        }

        if (File::exists(__DIR__.sprintf('/../resources/views/policy/privacy-policy.%s.md', $locale))) {
            return Str::markdown(File::get(__DIR__.sprintf('/../resources/views/policy/privacy-policy.%s.md', $locale)), $this->markdownConfig);
        }

        return null;
    }

    public function cookiePolicyHtml(): HtmlString
    {
        $cookiePolicyText = $this->cookiePolicyText(app()->getLocale())
            ?? $this->cookiePolicyText('en');

        return new HtmlString($cookiePolicyText);
    }

    public function privacyPolicyHtml(): HtmlString
    {
        $privacyPolicyText = $this->privacyPolicyText(app()->getLocale())
            ?? $this->privacyPolicyText('en');

        return new HtmlString($privacyPolicyText);
    }

    public function dataOwnerHtml(): HtmlString
    {
        return Str::of(config('cookie-solution.data_owner.name_and_address', ''))
            ->markdown(array_merge($this->markdownConfig, [
                'renderer' => [
                    'soft_break' => '<br>',
                ],
            ]))
            ->when(config('cookie-solution.data_owner.contact_email'), function (Stringable $string, string $email) {
                $contactEmail = Str::of(sprintf('__%s__ %s', __('cookie-solution::texts.privacy_policy.data_processing_owner_email'), $email))
                    ->markdown($this->markdownConfig);

                return $string->newLine()
                    ->append($contactEmail);
            })
            ->toHtmlString();
    }

    protected function configDigest(): string
    {
        $cookies = $this->services()
            ->flatMap(fn (Service $service) => collect($service->cookies)->map(fn (Cookie $cookie) => Arr::only($cookie->toArray(), ['name', 'purpose', 'duration'])))
            ->toJson();

        return hash('sha256', $cookies);
    }
}
