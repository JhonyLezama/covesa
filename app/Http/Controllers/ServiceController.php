<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Setting;
use App\Support\MediaStorage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Página "Servicios" (Semana 5 Día 2): acordeón institucional
     * hardcodeado + grid de proyectos reales publicados.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'limit' => ['nullable', 'integer', 'min:2', 'max:48'],
        ]);
        $limit = $validated['limit'] ?? 5;

        $total = Project::where('is_published', true)->count();

        $projects = Project::with(['zone:id,name', 'status:id,slug,name,color', 'client:id,name,logo_path,show_name', 'media'])
            ->where('is_published', true)
            ->orderBy('order')
            ->orderByDesc('updated_at')
            ->limit($limit)
            ->get()
            ->map(function (Project $project) {
                $translation = $project->translations->firstWhere('locale', 'es');
                $featured = $project->media->firstWhere('type', 'featured')
                    ?? $project->media->sortBy('order')->first();

                return [
                    'name' => $project->name,
                    'slug' => $project->slug,
                    'client_name' => $project->clientName(),
                    'client' => [
                        'name' => $project->clientName(),
                        'logo_url' => $project->client?->logoUrl(),
                        'show_name' => $project->client?->show_name ?? true,
                    ],
                    'service_type' => $project->service_type,
                    'zone' => $project->zone?->name,
                    'status' => $project->status
                        ? ['slug' => $project->status->slug, 'name' => $project->status->name, 'color' => $project->status->color]
                        : null,
                    'title' => $translation?->title ?? $project->name,
                    'subtitle' => $translation?->subtitle,
                    'description' => $translation?->description,
                    'cover' => $featured
                        ? MediaStorage::url($featured->path)
                        : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
                    'href' => "/proyectos/{$project->slug}",
                ];
            })
            ->all();

        return Inertia::render('Servicios', [
            'projects' => $projects,
            'total' => $total,
            'hasMore' => $total > count($projects),
            'limit' => $limit,
            'settings' => Setting::pluck('value', 'key')->all(),
        ]);
    }
}
