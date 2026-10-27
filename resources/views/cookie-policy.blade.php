<cookie-solution-policy-formatter>
    <div part="root" class="prose">
        <h1 part="headings h1">{{ __('cookie-solution::texts.cookie_policy.title') }}</h1>

        {{ \Keepsuit\CookieSolution\Facades\CookieSolution::cookiePolicyHtml() }}

        @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasCookies())
            <h2 part="headings h2">
                {{ __('cookie-solution::texts.cookie_policy.cookies_list') }}
            </h2>
            <div class="space-y-8" part="cookie-list">
                @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::servicesGroupedByCookiePurpose() as $purpose => $services)
                    @if($services->isNotEmpty())
                        <div part="purpose">
                            <div>
                                <h3 class="block font-bold" part="headings h3">{{ __('cookie-solution::texts.cookie_policy.purpose_'.$purpose) }}</h3>
                            </div>
                            <div>
                                @foreach($services as $service)
                                    @php
                                        /** @var \Keepsuit\CookieSolution\Service $service */
                                    @endphp
                                    <div class="mt-4 border-l-4 border-gray-300 px-4" part="service">
                                        <div>
                                            <span class="block font-medium md:inline" part="service-name">{{ $service->name }}</span>
                                            <span class="block text-sm md:inline md:text-sm" part="service-provider">({{ $service->provider }})</span>
                                        </div>
                                        <div class="mt-2 divide-y divide-gray-100">
                                            @foreach($service->cookies as $cookie)
                                                <div class="grid grid-cols-2 items-center gap-2 py-1 sm:grid-cols-4" part="cookie">
                                                    <div>
                                                        <span class="text-sm font-bold italic" part="cookie-name">{{ $cookie->name }}</span>
                                                    </div>
                                                    <div class="flex justify-end sm:justify-start">
                                                        <span class="rounded-lg bg-gray-100 px-2 py-1 text-sm font-bold text-gray-700" part="cookie-duration">
                                                            <cookie-solution-duration duration="{{ $cookie->duration }}"></cookie-solution-duration>
                                                        </span>
                                                    </div>
                                                    <div class="col-span-2 text-sm" part="cookie-description">
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
