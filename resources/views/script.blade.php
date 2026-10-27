@if($enabled)
    <script>
    window._cookieSolution = @json($config);
    </script>
    <script type="module" src="{{ $scriptUrl }}"></script>
@endif
