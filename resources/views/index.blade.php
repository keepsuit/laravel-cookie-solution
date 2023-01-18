<script>
window._cookieSolution = @json(\Keepsuit\CookieSolution\Facades\CookieSolution::getConfig())
</script>
<script>
{!! file_get_contents(base_path('vendor/keepsuit/laravel-cookie-solution/dist/laravel-cookie-solution.iife.js')) !!}
</script>

<cookie-solution-banner></cookie-solution-banner>
