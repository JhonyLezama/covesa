<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Catálogo inicial. A futuro reemplazar por modelo Property + query Eloquent.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function catalog(): array
    {
        return [
            [
                'image' => 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
                'title' => 'Torre San Isidro — Departamentos de lujo',
                'location' => 'San Isidro',
                'area' => '85 - 220 m²',
                'idealFor' => 'Familias y ejecutivos que buscan exclusividad',
                'status' => 'venta',
                'price' => 'Desde $185,000',
                'href' => '#',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
                'title' => 'Centro Empresarial Javier Prado',
                'location' => 'San Isidro',
                'area' => '150 - 500 m²',
                'idealFor' => 'Empresas que buscan oficinas premium',
                'status' => 'alquiler',
                'price' => '$25/m²',
                'href' => '#',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
                'title' => 'Residencial La Molina — Casas independientes',
                'location' => 'La Molina',
                'area' => '250 - 400 m²',
                'idealFor' => 'Familias que buscan espacio y tranquilidad',
                'status' => 'construccion',
                'price' => 'Desde $420,000',
                'href' => '#',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
                'title' => 'Plaza Comercial Surco',
                'location' => 'Surco',
                'area' => '80 - 300 m²',
                'idealFor' => 'Retail, restaurantes y servicios',
                'status' => 'venta',
                'price' => 'Desde $320,000',
                'href' => '#',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
                'title' => 'Miraflores Ocean View — Penthouse',
                'location' => 'Miraflores',
                'area' => '180 m²',
                'idealFor' => 'Inversionistas y compradores exclusivos',
                'status' => 'concluido',
                'price' => '$750,000',
                'href' => '#',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1582407947092-40a4e4e00daa?w=600&q=80',
                'title' => 'Nave Industrial ATE — Parque Industrial',
                'location' => 'Ate',
                'area' => '1,000 - 5,000 m²',
                'idealFor' => 'Logística, manufactura y almacenamiento',
                'status' => 'alquiler',
                'price' => '$8/m²',
                'href' => '#',
            ],
        ];
    }

    public function index(Request $request): Response
    {
        $tab = $request->string('tab')->toString() ?: 'todos';
        $q = mb_strtolower($request->string('q')->toString());
        $location = $request->string('location')->toString();

        $properties = collect(self::catalog())
            ->when($tab === 'venta', fn ($c) => $c->where('status', 'venta'))
            ->when($tab === 'alquiler', fn ($c) => $c->where('status', 'alquiler'))
            ->when($location !== '', function ($c) use ($location) {
                return $c->filter(fn ($p) => Str::slug($p['location']) === $location);
            })
            ->when($q !== '', function ($c) use ($q) {
                return $c->filter(fn ($p) => str_contains(
                    mb_strtolower($p['title'].' '.$p['location']),
                    $q
                ));
            })
            ->values()
            ->all();

        return Inertia::render('Home', [
            'properties' => $properties,
        ]);
    }
}
