@use('Keepsuit\CookieSolution\Facades\CookieSolution')
@if(CookieSolution::enabled())
    @php($config = CookieSolution::getConfig())
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

    // Read in the browser, not in PHP: a full-page cache would serve one visitor's consent to everyone.
    (function () {
        var cookieName = @json($config['cookie_name']);
        var digest = @json($config['digest']);
        var purposes = {};

        try {
            var value = document.cookie.split('; ').find(function (cookie) { return cookie.indexOf(cookieName + '=') === 0; });
            var status = value && JSON.parse(decodeURIComponent(value.slice(cookieName.length + 1)));

            if (status && status.digest === digest && status.purposes) {
                purposes = status.purposes;
            }
        } catch (e) {}

        gtag('consent', 'default', Object.assign(cookieSolutionConsent(purposes), { wait_for_update: 500 }));
    })();

    document.addEventListener('cookie-solution-status-change', function (event) {
        gtag('consent', 'update', cookieSolutionConsent(event.detail.purposes));
        dataLayer.push({ event: 'cookie-solution-status-change', status: event.detail.purposes });
    });
    </script>
@endif
