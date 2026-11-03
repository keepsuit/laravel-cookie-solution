@use('Keepsuit\CookieSolution\Facades\CookieSolution')
@if(CookieSolution::enabled())
    @php($config = CookieSolution::getConfig())
    {{-- Read in the browser, not in PHP: a full-page cache would serve one visitor's consent to everyone. --}}
    <script>(function (__cookieSolutionConfig) { {!! app(\Keepsuit\CookieSolution\CookieSolutionAssets::class)->getSavedStatusScript() !!} })(@json(['cookie_name' => $config['cookie_name'], 'digest' => $config['digest']]));</script>
@endif
