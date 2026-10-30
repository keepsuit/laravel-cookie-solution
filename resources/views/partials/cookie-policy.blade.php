<div part="root">
    <h1 part="headings h1">{{ __('cookie-solution::texts.cookie_policy.title') }}</h1>

    {{ \Keepsuit\CookieSolution\Facades\CookieSolution::cookiePolicyHtml() }}

    @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasCookies())
        <h2 part="headings h2">{{ __('cookie-solution::texts.cookie_policy.cookies_list') }}</h2>
        <div part="cookie-list">
            @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::servicesGroupedByCookiePurpose() as $purpose => $services)
                @if($services->isNotEmpty())
                    <section part="purpose">
                        <h3 part="headings h3">{{ __('cookie-solution::texts.cookie_policy.purpose_'.$purpose) }}</h3>
                        <ul part="services">
                            @foreach($services as $service)
                                @php
                                    /** @var \Keepsuit\CookieSolution\Service $service */
                                @endphp
                                <li part="service">
                                    <p part="service-header">
                                        <span part="service-name">{{ $service->name }}</span>
                                        <span part="service-provider">({{ $service->provider }})</span>
                                    </p>
                                    <dl part="service-cookies">
                                        @foreach($service->cookies as $cookie)
                                            <div part="cookie">
                                                <dt part="cookie-name">{{ $cookie->name }}</dt>
                                                <dd part="cookie-duration"><cookie-solution-duration duration="{{ $cookie->duration }}" session-label="{{ __('cookie-solution::texts.cookie_policy.duration_session') }}"></cookie-solution-duration></dd>
                                                <dd part="cookie-description">{{ $cookie->description }}</dd>
                                            </div>
                                        @endforeach
                                    </dl>
                                </li>
                            @endforeach
                        </ul>
                    </section>
                @endif
            @endforeach
        </div>
    @endif
</div>
