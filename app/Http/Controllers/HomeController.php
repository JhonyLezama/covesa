<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Setting;
use App\Models\Zone;
use App\Support\MediaStorage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Mapeo del filtro "¿Para qué lo quiero?" (HTML) a tags de ideal_for.
     *
     * @var array<string, list<string>>
     */
    private const PURPOSE_KEYWORDS = [
        'almacenes' => ['almacen', 'deposito', 'logistica', 'transporte', 'taller'],
        'locales' => ['local', 'comercial', 'tienda', 'venta'],
        'residencial' => ['residencial', 'vivienda', 'familia', 'colegio', 'casa'],
    ];

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'tab' => ['nullable', 'string', 'in:todos,venta,alquiler'],
            'type' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'purpose' => ['nullable', 'string', 'in:almacenes,locales,residencial'],
            'priceRange' => ['nullable', 'string', 'max:32'],
            'q' => ['nullable', 'string', 'max:255'],
        ]);

        $tab = $validated['tab'] ?? 'todos';

        $properties = Property::with(['type:id,name,slug', 'zone:id,name,slug', 'status:id,name', 'media'])
            ->where('is_published', true)
            ->when($tab !== 'todos', fn ($q) => $q->where('operation', $tab))
            ->when($validated['type'] ?? null, fn ($q, $type) => $q->whereHas('type', fn ($t) => $t->where('slug', $type)))
            ->when($validated['location'] ?? null, fn ($q, $loc) => $q->whereHas('zone', fn ($z) => $z->where('slug', $loc)))
            ->when($validated['purpose'] ?? null, function ($q, $purpose) {
                $q->where(function ($w) use ($purpose): void {
                    foreach (self::PURPOSE_KEYWORDS[$purpose] as $keyword) {
                        $w->orWhere('ideal_for', 'like', "%{$keyword}%");
                    }
                });
            })
            ->when($validated['priceRange'] ?? null, function ($q, $range) {
                if (str_ends_with($range, '+')) {
                    $q->where('price', '>=', (float) rtrim($range, '+'));
                } elseif (str_contains($range, '-')) {
                    [$min, $max] = explode('-', $range, 2);
                    $q->whereBetween('price', [(float) $min, (float) $max]);
                }
            })
            ->when($validated['q'] ?? null, fn ($q, $term) => $q->where(
                fn ($w) => $w->where('title', 'like', "%{$term}%")
                    ->orWhereHas('zone', fn ($z) => $z->where('name', 'like', "%{$term}%"))
            ))
            ->orderByDesc('is_featured')
            ->orderByDesc('updated_at')
            ->limit(6)
            ->get()
            ->map(fn (Property $p) => [
                'image' => $this->cover($p),
                'title' => $p->title,
                'slug' => $p->slug,
                'type' => $p->type?->name,
                'location' => $p->zone?->name ?? '',
                'area' => $this->formatArea((float) $p->area_total, $p->area_unit),
                'lots' => $p->lots_available,
                'idealFor' => is_array($p->ideal_for) ? implode(', ', $p->ideal_for) : null,
                'status' => $p->operation,
                'price' => $p->price
                    ? $p->currency.' '.number_format((float) $p->price, 2).($p->price_type === 'por_m2' ? '/m²' : '')
                    : null,
                'href' => "/propiedades/{$p->slug}",
            ])
            ->all();

        return Inertia::render('Home', [
            'properties' => $properties,
            'filterOptions' => [
                'types' => PropertyType::where('is_active', true)->orderBy('order')->get(['slug', 'name']),
                'zones' => Zone::where('is_active', true)->orderBy('name')->get(['slug', 'name']),
            ],
            'settings' => Setting::pluck('value', 'key')->all(),
        ]);
    }

    /**
     * "6,692.33 m²" / "1,500 m²": decimales solo si existen, como el diseño.
     */
    protected function formatArea(float $total, string $unit): string
    {
        $decimals = fmod($total, 1.0) === 0.0 ? 0 : 2;

        return number_format($total, $decimals).' '.($unit === 'm2' ? 'm²' : $unit);
    }

    protected function cover(Property $property): string
    {
        $featured = $property->media->firstWhere('type', 'featured')
            ?? $property->media->sortBy('order')->first();

        if ($featured) {
            return MediaStorage::url($featured->path);
        }

        return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80';
    }
}
