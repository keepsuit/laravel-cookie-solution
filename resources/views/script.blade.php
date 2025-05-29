@if($enabled)
    @if($highlightColor)
        <style>
            :root {
                --cs--color-highlight: {{ $highlightColor }};
            }
        </style>
    @endif
    <script type="module">
    window._cookieSolution = @json($config);
    </script>
    <script type="module" src="{{ $scriptUrl }}"></script>
@endif
