@if($enabled)
    <script>
    window._cookieSolution = @json($config);
    </script>
    <script defer src="{{ $scriptUrl }}"></script>
@endif
