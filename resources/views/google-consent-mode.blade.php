@use('Keepsuit\CookieSolution\CookiePurpose')
@use('Keepsuit\CookieSolution\Facades\CookieSolution')
@if(CookieSolution::enabled())
    @php
        $status = CookieSolution::status();
        $accepted = collect(CookiePurpose::cases())->mapWithKeys(fn (CookiePurpose $purpose) => [$purpose->value => $status->accepted($purpose)]);
    @endphp
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }

    function cookieSolutionConsent(purposes) {
        function state(purpose) {
            return purposes[purpose] === true ? 'granted' : 'denied';
        }

        return {
            ad_storage: state('marketing'),
            ad_user_data: state('marketing'),
            ad_personalization: state('marketing'),
            analytics_storage: state('statistics'),
            personalization_storage: state('preferences'),
            functionality_storage: 'granted',
            security_storage: 'granted',
        };
    }

    gtag('consent', 'default', Object.assign(cookieSolutionConsent(@json($accepted)), { wait_for_update: 500 }));

    document.addEventListener('cookie-solution-status-change', function (event) {
        gtag('consent', 'update', cookieSolutionConsent(event.detail.purposes));
        dataLayer.push({ event: 'cookie-solution-status-change', status: event.detail.purposes });
    });
    </script>
@endif
