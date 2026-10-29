<cookie-solution-policy-formatter @if(config('cookie-solution.highlight_color')) style="--cs--color-highlight: {{ config('cookie-solution.highlight_color') }}" @endif>
    <div part="root" class="prose">
        <h1 part="headings h1">{{ __('cookie-solution::texts.cookie_policy.title') }}</h1>

        {{ \Keepsuit\CookieSolution\Facades\CookieSolution::cookiePolicyHtml() }}

        @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasCookies())
            <h2 part="headings h2">
                {{ __('cookie-solution::texts.cookie_policy.cookies_list') }}
            </h2>
            <div class="not-prose mt-6 space-y-8" part="cookie-list">
                @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::servicesGroupedByCookiePurpose() as $purpose => $services)
                    @if($services->isNotEmpty())
                        <div part="purpose">
                            <div>
                                <h3 class="text-base font-semibold text-gray-900" part="headings h3">{{ __('cookie-solution::texts.cookie_policy.purpose_'.$purpose) }}</h3>
                            </div>
                            <div class="mt-3 grid gap-3" part="services">
                                @foreach($services as $service)
                                    @php
                                        /** @var \Keepsuit\CookieSolution\Service $service */
                                    @endphp
                                    <div class="rounded-xl border border-gray-200 px-4 py-3 sm:px-5 sm:py-4" part="service">
                                        <div part="service-header">
                                            <span class="block font-semibold text-gray-900 md:inline" part="service-name">{{ $service->name }}</span>
                                            <span class="block text-sm text-gray-600 md:inline" part="service-provider">({{ $service->provider }})</span>
                                        </div>
                                        <div class="mt-2 divide-y divide-gray-100" part="service-cookies">
                                            @foreach($service->cookies as $cookie)
                                                <div class="grid grid-cols-2 items-center gap-x-4 gap-y-1 py-2.5 sm:grid-cols-4" part="cookie">
                                                    <div>
                                                        <span class="text-sm font-semibold break-all text-gray-900" part="cookie-name">{{ $cookie->name }}</span>
                                                    </div>
                                                    <div class="flex justify-end sm:justify-start">
                                                        <span class="rounded-md bg-white px-2 py-0.5 text-xs font-medium whitespace-nowrap text-gray-700 ring-1 ring-gray-200" part="cookie-duration">
                                                            <cookie-solution-duration duration="{{ $cookie->duration }}" session-label="{{ __('cookie-solution::texts.cookie_policy.duration_session') }}"></cookie-solution-duration>
                                                        </span>
                                                    </div>
                                                    <div class="col-span-2 text-sm text-gray-600" part="cookie-description">
                                                        {{ $cookie->description }}
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                @endforeach
            </div>
        @endif
    </div>
</cookie-solution-policy-formatter>
