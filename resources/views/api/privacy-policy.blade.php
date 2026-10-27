<h1>{{ __('cookie-solution::texts.privacy_policy.title') }}</h1>

{{ \Keepsuit\CookieSolution\Facades\CookieSolution::privacyPolicyHtml() }}

@if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasDataOwner())
    <h2>{{ __('cookie-solution::texts.privacy_policy.data_processing_owner') }}</h2>
    {{ \Keepsuit\CookieSolution\Facades\CookieSolution::dataOwnerHtml() }}
@endif

@if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasServices())
    <h2>{{ __('cookie-solution::texts.privacy_policy.services_list') }}</h2>
    @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::services() as $service)
        <h3>{{ $service->name }} ({{ $service->provider }})</h3>
        <p>{{ $service->description }}</p>
        @if($service->dataProcessingLocation)
            <p>{{ __('cookie-solution::texts.privacy_policy.service_data_processing_location') }} {{ $service->dataProcessingLocation }}</p>
        @endif
        @if($service->privacyPolicyUrl)
            <p><a href="{{ $service->privacyPolicyUrl }}" target="_blank" rel="noreferrer nofollow">{{ __('cookie-solution::texts.privacy_policy.service_privacy_policy') }}</a></p>
        @endif
    @endforeach
@endif
