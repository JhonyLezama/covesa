<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>COVESA — Inmobiliaria & Constructora | +35 años de experiencia</title>
    <meta name="description" content="COVESA es una empresa inmobiliaria y constructora peruana con más de 35 años de experiencia. Proyectos residenciales, comerciales e industriales.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @routes
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
