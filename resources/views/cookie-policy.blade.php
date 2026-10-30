<cookie-solution-policy-formatter color-scheme="{{ \Keepsuit\CookieSolution\Facades\CookieSolution::colorScheme() }}" @if(config('cookie-solution.highlight_color')) highlight-color="{{ config('cookie-solution.highlight_color') }}" @endif>
    @include('cookie-solution::partials.cookie-policy')
</cookie-solution-policy-formatter>
