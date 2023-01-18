<?php

namespace Keepsuit\CookieSolution;

use Illuminate\Support\Arr;

class CookieSolution
{
    /**
     * @var Service[]
     */
    protected array $services = [];

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
                    ->all();

                return [
                    'provider' => $service->provider(),
                    'cookies' => $cookies,
                ];
            })
            ->filter(fn (array $service) => count($service['cookies']) > 0)
            ->values()
            ->all();
    }
}
