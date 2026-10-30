<div part="root">
    <h1 part="headings h1">{{ __('cookie-solution::texts.privacy_policy.title') }}</h1>

    {{ \Keepsuit\CookieSolution\Facades\CookieSolution::privacyPolicyHtml() }}

    @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasDataOwner())
        <h2 part="headings h2">{{ __('cookie-solution::texts.privacy_policy.data_processing_owner') }}</h2>
        <div part="data-owner">
            {{ \Keepsuit\CookieSolution\Facades\CookieSolution::dataOwnerHtml() }}
        </div>
    @endif

    @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasServices())
        <h2 part="headings h2">{{ __('cookie-solution::texts.privacy_policy.services_list') }}</h2>
        <ul part="privacy-list">
            @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::services() as $service)
                <li part="service">
                    <div part="service-header">
                        <h3 part="service-title">
                            <span part="service-name">{{ $service->name }}</span>
                            <span part="service-provider">({{ $service->provider }})</span>
                        </h3>
                        @if($service->privacyPolicyUrl)
                            <a href="{{ $service->privacyPolicyUrl }}" target="_blank" rel="noreferrer nofollow" part="service-link">{{ __('cookie-solution::texts.privacy_policy.service_privacy_policy') }}</a>
                        @endif
                    </div>
                    <p part="service-description">{{ $service->description }}</p>
                    @if($service->dataProcessingLocation)
                        <p part="service-location">
                            {{ __('cookie-solution::texts.privacy_policy.service_data_processing_location') }}
                            <span part="service-location-value">{{ $service->dataProcessingLocation }}</span>
                        </p>
                    @endif
                </li>
            @endforeach
        </ul>
    @endif
</div>
