<script>
{!! file_get_contents(base_path('vendor/keepsuit/laravel-cookie-solution/dist/laravel-cookie-solution.iife.js')) !!}
</script>

<cookie-solution-banner>
    <div slot="title">
        {{ __('cookie-solution::banner.title') }}
    </div>
    <div slot="message">
        {{ __('cookie-solution::banner.message') }}
    </div>
    <span slot="accept-all-button">
        {{ __('cookie-solution::banner.accept_all_button') }}
    </span>
    <span slot="refuse-button">
        {{ __('cookie-solution::banner.refuse_button') }}
    </span>
    <span slot="customize-button">
        {{ __('cookie-solution::banner.customize_button') }}
    </span>
</cookie-solution-banner>
