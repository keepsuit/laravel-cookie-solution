<html lang="{{ app()->getLocale() }}">
<head>
    <title>
        Cookie Solution custom toggle
    </title>
    @include('cookie-solution::script')
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans antialiased">
<main class="max-w-screen-lg mx-auto px-4 grid gap-16 py-16">
   <div>
       <button class="text-lg hover:underline" data-cookie-solution-toggle>
           cookie preferences
       </button>
   </div>
</main>
</body>
</html>
