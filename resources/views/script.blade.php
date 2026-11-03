@if($enabled)
    @include('cookie-solution::status')
    <script>
    window._cookieSolution = @json($config);
    </script>
    <script defer src="{{ $scriptUrl }}"></script>
@endif
