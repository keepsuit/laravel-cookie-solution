<cookie-solution-policy-formatter @if(config('cookie-solution.highlight_color')) style="--cs--color-highlight: {{ config('cookie-solution.highlight_color') }}" @endif>
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
            <div class="not-prose mt-6 grid gap-3" part="privacy-list">
                @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::services() as $service)
                    <div class="rounded-xl border border-gray-200 px-4 py-3 sm:px-5 sm:py-4" part="service">
                        <div class="justify-between gap-4 md:flex" part="service-header">
                            <div>
                                <span class="block font-semibold text-gray-900 md:inline" part="service-name">{{ $service->name }}</span>
                                <span class="block text-sm text-gray-600 md:inline" part="service-provider">({{ $service->provider }})</span>
                            </div>
                            @if($service->privacyPolicyUrl)
                                <a href="{{ $service->privacyPolicyUrl }}" target="_blank" rel="noreferrer nofollow" class="mt-1 inline-block shrink-0 text-sm font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-current md:mt-0" part="service-link">
                                    {{ __('cookie-solution::texts.privacy_policy.service_privacy_policy') }}
                                </a>
                            @endif
                        </div>
                        <div class="mt-2 text-sm/6 text-gray-600" part="service-description">
                            {{ $service->description }}
                        </div>
                        @if($service->dataProcessingLocation)
                            <div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600" part="service-location">
                                {{ __('cookie-solution::texts.privacy_policy.service_data_processing_location') }}
                                <span class="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200" part="service-location-value">{{ $service->dataProcessingLocation }}</span>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</cookie-solution-policy-formatter>
