<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Property;
use App\Models\Setting;
use App\Support\MediaStorage;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    /**
     * Landing pública del proyecto. Para `el-milagro` envía el payload
     * completo del Día 3 Semana 5 (hero, características, brochure y
     * propiedades asociadas dinámicas desde BD).
     */
    public function show(string $slug): Response
    {
        $project = Project::with(['zone:id,name', 'status:id,name,color', 'client:id,name,logo_path,show_name', 'media'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $translation = $project->translations()->where('locale', 'es')->first();

        $gallery = $project->media()->orderBy('order')->get();
        $featured = $gallery->firstWhere('type', 'featured') ?? $gallery->first();
        $brochure = $gallery->firstWhere('type', 'brochure');
        $logo = $gallery->firstWhere('type', 'logo');

        return Inertia::render('Projects/Show', [
            'project' => [
                'slug' => $project->slug,
                'name' => $project->name,
                'client_name' => $project->clientName(),
                'client' => [
                    'name' => $project->clientName(),
                    'logo_url' => $project->client?->logoUrl(),
                ],
                // Esquina superior: logo subido manda; si no, distintivo de
                // icono + texto editable en Admin → Proyectos.
                'logo_url' => $logo ? MediaStorage::url($logo->path) : $project->client?->logoUrl(),
                'badge' => [
                    'top' => $translation?->badge_top,
                    'title' => $translation?->badge_title ?? $project->name,
                ],
                'service_type' => $project->service_type,
                'zone' => $project->zone?->name,
                'status' => $project->status ? ['name' => $project->status->name, 'color' => $project->status->color] : null,
                'title' => $translation?->title ?? $project->name,
                'subtitle' => $translation?->subtitle,
                'description' => $translation?->description,
                'features' => $translation?->features ?? [],
                'hero_image' => $featured ? MediaStorage::url($featured->path) : null,
                'brochure_url' => $brochure ? MediaStorage::url($brochure->path) : null,
                'gallery' => $gallery
                    ->map(fn ($m) => MediaStorage::url($m->path))->all(),
                'properties' => $this->associatedProperties($project),
            ],
            'settings' => Setting::pluck('value', 'key')->all(),
        ]);
    }

    /**
     * Propiedades asociadas al proyecto (is_published). Si el proyecto aún
     * no tiene lotes vinculados, fallback a destacadas generales para no
     * dejar el carrusel vacío. Mismo shape que HomeController.
     *
     * @return list<array<string, mixed>>
     */
    protected function associatedProperties(Project $project): array
    {
        $associated = Property::with(['type:id,name,slug', 'zone:id,name,slug', 'status:id,name', 'media'])
            ->where('project_id', $project->id)
            ->where('is_published', true)
            ->orderByDesc('is_featured')
            ->orderByDesc('updated_at')
            ->limit(10)
            ->get();

        $list = $associated->isNotEmpty() ? $associated : Property::with(['type:id,name,slug', 'zone:id,name,slug', 'status:id,name', 'media'])
            ->where('is_published', true)
            ->where('is_featured', true)
            ->orderByDesc('updated_at')
            ->limit(6)
            ->get();

        return $list->map(fn (Property $p) => [
            'image' => $this->cover($p),
            'title' => $p->title,
            'slug' => $p->slug,
            'type' => $p->type?->name,
            'location' => $p->zone?->name ?? '',
            'area' => $this->formatArea((float) $p->area_total, (string) $p->area_unit),
            'lots' => $p->lots_available,
            'idealFor' => is_array($p->ideal_for) ? implode(', ', $p->ideal_for) : null,
            'status' => $p->operation,
            'price' => $p->price
                ? $p->currency.' '.number_format((float) $p->price, 2).($p->price_type === 'por_m2' ? '/m²' : '')
                : null,
            'href' => "/propiedades/{$p->slug}",
        ])->all();
    }

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
