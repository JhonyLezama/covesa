<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Setting;
use App\Support\MediaStorage;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    /**
     * Landing mínima del proyecto (Día 2 Semana 4): existe para que los
     * badges flotantes sean links reales. La landing completa es Semana 5.
     */
    public function show(string $slug): Response
    {
        $project = Project::with(['zone:id,name', 'status:id,name,color', 'media'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $translation = $project->translations()->where('locale', 'es')->first();

        return Inertia::render('Projects/Show', [
            'project' => [
                'name' => $project->name,
                'client_name' => $project->client_name,
                'service_type' => $project->service_type,
                'zone' => $project->zone?->name,
                'status' => $project->status ? ['name' => $project->status->name, 'color' => $project->status->color] : null,
                'title' => $translation?->title ?? $project->name,
                'subtitle' => $translation?->subtitle,
                'description' => $translation?->description,
                'features' => $translation?->features ?? [],
                'gallery' => $project->media()->orderBy('order')->get()
                    ->map(fn ($m) => MediaStorage::url($m->path))->all(),
            ],
            'settings' => Setting::pluck('value', 'key')->all(),
        ]);
    }
}
