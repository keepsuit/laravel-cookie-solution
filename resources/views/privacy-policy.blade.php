<cookie-solution-policy-formatter>
    <div part="root" class="prose">
        <h1 part="headings h1">
            {{ __('cookie-solution::texts.privacy_policy.title') }}
        </h1>

        {{ \Keepsuit\CookieSolution\Facades\CookieSolution::privacyPolicyHtml() }}

        @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasDataOwner())
            <h2 part="headings h2">
                {{ __('cookie-solution::texts.privacy_policy.data_processing_owner') }}
            </h2>
            <div part="data-owner" class="text-sm">
                {{ \Keepsuit\CookieSolution\Facades\CookieSolution::dataOwnerHtml() }}
            </div>
        @endif

        @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasServices())
            <h2 part="headings h2">
                {{ __('cookie-solution::texts.privacy_policy.services_list') }}
            </h2>
            <div class="space-y-8" part="privacy-list">
                @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::services() as $service)
                    <div class="border-l-4 border-gray-300 px-4" part="service">
                        <div class="md:flex justify-between">
                            <div>
                                <span class="block font-medium md:inline" part="service-name">{{ $service->name }}</span>
                                <span class="block text-sm md:inline md:text-sm" part="service-provider">({{ $service->provider }})</span>
                            </div>
                            @if($service->privacyPolicyUrl)
                                <a href="{{ $service->privacyPolicyUrl }}" target="_blank" rel="noreferrer nofollow" class="text-sm" part="service-link">
                                    {{ __('cookie-solution::texts.privacy_policy.service_privacy_policy') }}
                                </a>
                            @endif
                        </div>
                        <div class="mt-4 text-sm" part="service-description">
                            {{ $service->description }}
                        </div>
                        @if($service->dataProcessingLocation)
                            <div class="mt-4 text-sm" part="service-location">
                                {{ __('cookie-solution::texts.privacy_policy.service_data_processing_location') }}
                                <span class="underline" part="service-location-value">{{ $service->dataProcessingLocation }}</span>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</cookie-solution-policy-formatter>
