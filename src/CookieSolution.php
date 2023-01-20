<?php

namespace Keepsuit\CookieSolution;

use Illuminate\Support\Arr;
use Illuminate\Support\HtmlString;

class CookieSolution
{
    /**
     * @var Service[]
     */
    protected array $services = [];

    public function __construct(
        protected CookieSolutionAssets $assets,
    ) {
    }

    public function enabled(): bool
    {
        return config('cookie-solution.enabled', true);
    }

    public function getConfig(): array
    {
        return [
            'cookie_name' => config('cookie-solution.cookie_name'),
            'cookie_lifetime' => config('cookie-solution.cookie_lifetime'),
            'texts' => [
                'tab_consent' => __('cookie-solution::banner.tab_consent'),
                'tab_customize' => __('cookie-solution::banner.tab_customize'),
                'tab_information' => __('cookie-solution::banner.tab_information'),
                'button_accept_all' => __('cookie-solution::banner.button_accept_all'),
                'button_accept_selected' => __('cookie-solution::banner.button_accept_selected'),
                'button_refuse' => __('cookie-solution::banner.button_refuse'),
                'button_customize' => __('cookie-solution::banner.button_customize'),
                'consent_title' => __('cookie-solution::banner.consent_title'),
                'consent_message' => __('cookie-solution::banner.consent_message'),
                'customize_purpose_necessary' => __('cookie-solution::banner.customize_purpose_necessary'),
                'customize_purpose_necessary_description' => __('cookie-solution::banner.customize_purpose_necessary_description'),
                'customize_purpose_preferences' => __('cookie-solution::banner.customize_purpose_preferences'),
                'customize_purpose_preferences_description' => __('cookie-solution::banner.customize_purpose_preferences_description'),
                'customize_purpose_statistics' => __('cookie-solution::banner.customize_purpose_statistics'),
                'customize_purpose_statistics_description' => __('cookie-solution::banner.customize_purpose_statistics_description'),
                'customize_purpose_marketing' => __('cookie-solution::banner.customize_purpose_marketing'),
                'customize_purpose_marketing_description' => __('cookie-solution::banner.customize_purpose_marketing_description'),
            ],
            'cookies' => [
                CookiePurpose::NECESSARY->value => $this->getCookiesConfigForPurpose(CookiePurpose::NECESSARY),
                CookiePurpose::PREFERENCES->value => $this->getCookiesConfigForPurpose(CookiePurpose::PREFERENCES),
                CookiePurpose::STATISTICS->value => $this->getCookiesConfigForPurpose(CookiePurpose::STATISTICS),
                CookiePurpose::MARKETING->value => $this->getCookiesConfigForPurpose(CookiePurpose::MARKETING),
            ],
        ];
    }

    public function register(Service $service): self
    {
        $this->services[] = $service;

        return $this;
    }

    protected function getCookiesConfigForPurpose(CookiePurpose $cookiePurpose): array
    {
        return collect($this->services)
            ->map(function (Service $service) use ($cookiePurpose) {
                $cookies = collect($service->cookies())
                    ->filter(fn (Cookie $cookie) => $cookie->purpose === $cookiePurpose)
                    ->map(fn (Cookie $cookie) => Arr::except($cookie->toArray(), 'purpose'))
                    ->values()
                    ->all();

                return [
                    'provider' => $service->provider(),
                    'name' => $service->name(),
                    'cookies' => $cookies,
                ];
            })
            ->filter(fn (array $service) => count($service['cookies']) > 0)
            ->values()
            ->all();
    }

    public function script(): HtmlString
    {
        $scriptUrl = $this->assets->getScriptUrl();
        $config = json_encode($this->getConfig());

        return new HtmlString(<<<HTML
            <script>
            window._cookieSolution = $config;
            </script>
            <script type="module" src="$scriptUrl"></script>
            HTML
        );
    }
}
