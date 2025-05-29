<html lang="{{ app()->getLocale() }}">
<head>
    <title>
        Cookie Solution
    </title>
    @include('cookie-solution::script')
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans antialiased">
<header class="max-w-screen-lg mx-auto px-4">
    <nav class="h-12 flex items-center gap-4">
        @foreach($locales as $locale)
            <a href="/{{ $locale }}" class="block uppercase {{ app()->getLocale() === $locale ? 'font-medium text-orange-500' : 'hover:text-orange-600' }}">{{ $locale }}</a>
        @endforeach
    </nav>
</header>
<main class="max-w-screen-lg mx-auto px-4 grid gap-16 py-16">
    <div>
        <button class="text-lg hover:underline" data-cookie-solution-toggle>
            cookie preferences
        </button>
    </div>
    <hr>
    <section>
        @include('cookie-solution::cookie-policy')
    </section>
    <hr>
    <section>
        @include('cookie-solution::privacy-policy')
    </section>
</main>
</body>
</html>
