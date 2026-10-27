<h1>{{ __('cookie-solution::texts.cookie_policy.title') }}</h1>

{{ \Keepsuit\CookieSolution\Facades\CookieSolution::cookiePolicyHtml() }}

@if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasCookies())
    <h2>{{ __('cookie-solution::texts.cookie_policy.cookies_list') }}</h2>
    @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::servicesGroupedByCookiePurpose() as $purpose => $services)
        @if($services->isNotEmpty())
            <h3>{{ __('cookie-solution::texts.cookie_policy.purpose_'.$purpose) }}</h3>
            <ul>
                @foreach($services as $service)
                    @php
                        /** @var \Keepsuit\CookieSolution\Service $service */
                    @endphp
                    <li>
                        <p>{{ $service->name }} ({{ $service->provider }})</p>
                        <ul>
                            @foreach($service->cookies as $cookie)
                                <li>
                                    <dl>
                                        <dt>{{ $cookie->name }}</dt>
                                        <dd><cookie-solution-duration duration="{{ $cookie->duration }}" session-label="{{ __('cookie-solution::texts.cookie_policy.duration_session') }}"></cookie-solution-duration></dd>
                                        <dd>{{ $cookie->description }}</dd>
                                    </dl>
                                </li>
                            @endforeach
                        </ul>
                    </li>
                @endforeach
            </ul>
        @endif
    @endforeach
@endif
