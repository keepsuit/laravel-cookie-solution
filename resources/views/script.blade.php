@if($enabled)
    @if($highlightColor)
        <style>
            :root {
                --cs--color-highlight: {{ $highlightColor }};
            }
        </style>
    @endif
    <script>
    window._cookieSolution = @json($config);
    </script>
    <script type="module" src="{{ $scriptUrl }}"></script>
@endif
