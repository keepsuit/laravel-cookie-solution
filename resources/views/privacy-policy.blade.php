<cookie-solution-policy-formatter>
    <div class="prose">
        <h1>
            {{ __('cookie-solution::texts.privacy_policy.title') }}
        </h1>

        {{ \Keepsuit\CookieSolution\Facades\CookieSolution::privacyPolicyHtml() }}

        @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasDataOwner())
            <h2>
                {{ __('cookie-solution::texts.privacy_policy.data_processing_owner') }}
            </h2>
            <div class="text-sm">
                {{ \Keepsuit\CookieSolution\Facades\CookieSolution::dataOwnerHtml() }}
            </div>
        @endif

        @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasServices())
            <h2>
                {{ __('cookie-solution::texts.privacy_policy.services_list') }}
            </h2>
            <div class="space-y-8">
                @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::services() as $service)
                    <div class="border-l-4 border-gray-300 px-4">
                        <div class="md:flex justify-between">
                            <div>
                                <span class="block font-medium md:inline">{{ $service->name }}</span>
                                <span class="block text-sm md:inline md:text-sm">({{ $service->provider }})</span>
                            </div>
                            @if($service->privacyPolicyUrl)
                                <a href="{{ $service->privacyPolicyUrl }}" target="_blank" rel="noreferrer nofollow" class="text-sm">
                                    privacy policy
                                </a>
                            @endif
                        </div>
                        <div class="mt-4 text-sm">
                            {{ $service->description }}
                        </div>
                        @if($service->dataProcessingLocation)
                            <div class="mt-4 text-sm">
                                {{ __('cookie-solution::texts.privacy_policy.service_data_processing_location') }}
                                <span class="underline">{{ $service->dataProcessingLocation }}</span>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</cookie-solution-policy-formatter>
