@use('Keepsuit\CookieSolution\Facades\CookieSolution')
@if(CookieSolution::enabled())
    @include('cookie-solution::status')
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

    (function () {
        var status = window.cookieSolutionSavedStatus();
        var purposes = status ? status.purposes : {};

        gtag('consent', 'default', Object.assign(cookieSolutionConsent(purposes), { wait_for_update: 500 }));
    })();

    document.addEventListener('cookie-solution-status-change', function (event) {
        gtag('consent', 'update', cookieSolutionConsent(event.detail.purposes));
        dataLayer.push({ event: 'cookie-solution-status-change', status: event.detail.purposes });
    });
    </script>
@endif
