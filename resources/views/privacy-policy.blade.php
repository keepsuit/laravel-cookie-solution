<div class="prose">
    {{ \Keepsuit\CookieSolution\Facades\CookieSolution::privacyPolicyHtml() }}

    @if(\Keepsuit\CookieSolution\Facades\CookieSolution::hasServices())
        <h3>
            {{ __('cookie-solution::texts.privacy_policy.services_list') }}
        </h3>
        <div class="space-y-8 mt-8">
            @foreach(\Keepsuit\CookieSolution\Facades\CookieSolution::services() as $service)
                <div class="border-l-4 border-gray-300 px-4">
                    <div class="flex justify-between">
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
                    <div class="mt-2 text-sm">
                        {{ $service->description }}
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>
