<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Media;
use App\Models\Project;
use App\Models\Property;
use App\Models\Status;
use App\Models\Zone;
use App\Support\MediaStorage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'status_id' => ['nullable', 'integer'],
            'published' => ['nullable', 'string', 'in:publicadas,borrador'],
        ]);

        $projects = Project::with(['zone:id,name', 'status:id,name,color'])
            ->when($validated['q'] ?? null, fn ($q, $term) => $q->where('name', 'like', "%{$term}%"))
            ->when($validated['status_id'] ?? null, fn ($q, $sid) => $q->where('status_id', $sid))
            ->when($validated['published'] ?? null, fn ($q, $pub) => $q->where('is_published', $pub === 'publicadas'))
            ->orderBy('order')
            ->orderByDesc('updated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Project $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'client_name' => $p->client_name,
                'is_published' => $p->is_published,
                'order' => $p->order,
                'zone' => $p->zone?->name,
                'status' => $p->status ? ['name' => $p->status->name, 'color' => $p->status->color] : null,
            ]);

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'status_id' => $validated['status_id'] ?? '',
                'published' => $validated['published'] ?? '',
            ],
            'statuses' => Status::where('type', 'project')->where('is_active', true)->orderBy('order')->get(['id', 'name']),
            'canEdit' => $request->user()->can('manage-content'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Project::class);

        return Inertia::render('Admin/Projects/Form', [
            'project' => null,
            ...$this->catalogs(),
        ]);
    }

    public function store(ProjectRequest $request): RedirectResponse
    {
        $this->authorize('create', Project::class);

        $data = $request->validated();

        $project = DB::transaction(function () use ($data) {
            $project = Project::create([
                ...collect($data)->except(['title', 'subtitle', 'description', 'features_text', 'slug'])->all(),
                'slug' => $this->resolveSlug($data['slug'] ?? null, $data['name']),
            ]);
            $project->translations()->create([
                'locale' => 'es',
                'title' => $data['title'],
                'subtitle' => $data['subtitle'] ?? null,
                'description' => $data['description'],
                'features' => $this->parseFeatures($data['features_text'] ?? null),
            ]);

            return $project;
        });

        return redirect()->route('admin.proyectos.index')
            ->with('success', "Proyecto {$project->name} creado correctamente.");
    }

    public function show(Project $proyecto): Response
    {
        $this->authorize('view', $proyecto);

        $proyecto->load(['zone:id,name', 'status:id,name,color']);

        return Inertia::render('Admin/Projects/Show', [
            'project' => [
                'id' => $proyecto->id,
                'name' => $proyecto->name,
                'slug' => $proyecto->slug,
                'client_name' => $proyecto->client_name,
                'service_type' => $proyecto->service_type,
                'is_published' => $proyecto->is_published,
                'zone' => $proyecto->zone?->name,
                'status' => $proyecto->status ? ['name' => $proyecto->status->name, 'color' => $proyecto->status->color] : null,
                'media_count' => $proyecto->media()->count(),
            ],
            'properties' => $proyecto->properties()->with(['type:id,name', 'zone:id,name', 'status:id,name'])
                ->orderBy('title')
                ->get()
                ->map(fn (Property $p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'operation' => $p->operation,
                    'is_published' => $p->is_published,
                    'type' => $p->type?->name,
                    'zone' => $p->zone?->name,
                    'status' => $p->status?->name,
                ])->all(),
            'canEdit' => request()->user()->can('manage-content'),
        ]);
    }

    public function edit(Project $proyecto): Response
    {        $this->authorize('update', $proyecto);

        $translation = $proyecto->translations()->where('locale', 'es')->first();

        return Inertia::render('Admin/Projects/Form', [
            'project' => [
                'id' => $proyecto->id,
                'name' => $proyecto->name,
                'slug' => $proyecto->slug,
                'status_id' => $proyecto->status_id,
                'zone_id' => $proyecto->zone_id,
                'client_name' => $proyecto->client_name,
                'service_type' => $proyecto->service_type,
                'video_url' => $proyecto->video_url,
                'latitude' => $proyecto->latitude,
                'longitude' => $proyecto->longitude,
                'order' => $proyecto->order,
                'is_published' => $proyecto->is_published,
                'title' => $translation?->title ?? $proyecto->name,
                'subtitle' => $translation?->subtitle,
                'description' => $translation?->description,
                'features_text' => $translation && is_array($translation->features)
                    ? implode("\n", $translation->features)
                    : null,
            ],
            'media' => $proyecto->media()->orderBy('order')->get()
                ->map(fn (Media $m) => [
                    'id' => $m->id,
                    'type' => $m->type,
                    'url' => MediaStorage::url($m->path),
                    'order' => $m->order,
                ])->all(),
            ...$this->catalogs(),
        ]);
    }

    public function update(ProjectRequest $request, Project $proyecto): RedirectResponse
    {
        $this->authorize('update', $proyecto);

        $data = $request->validated();

        DB::transaction(function () use ($data, $proyecto): void {
            $proyecto->update([
                ...collect($data)->except(['title', 'subtitle', 'description', 'features_text', 'slug'])->all(),
                'slug' => $this->resolveSlug($data['slug'] ?? null, $data['name'], $proyecto->id),
            ]);
            $proyecto->translations()->updateOrCreate(
                ['locale' => 'es'],
                [
                    'title' => $data['title'],
                    'subtitle' => $data['subtitle'] ?? null,
                    'description' => $data['description'],
                    'features' => $this->parseFeatures($data['features_text'] ?? null),
                ]
            );
        });

        return redirect()->route('admin.proyectos.index')
            ->with('success', "Proyecto {$proyecto->name} actualizado correctamente.");
    }

    public function destroy(Project $proyecto): RedirectResponse
    {
        $this->authorize('delete', $proyecto);

        $proyecto->delete();

        return redirect()->route('admin.proyectos.index')
            ->with('success', "Proyecto {$proyecto->name} eliminado correctamente.");
    }

    /**
     * @return array<string, mixed>
     */
    protected function catalogs(): array
    {
        return [
            'zones' => Zone::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'statuses' => Status::where('type', 'project')->where('is_active', true)->orderBy('order')->get(['id', 'name']),
        ];
    }

    protected function resolveSlug(?string $slug, string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($slug ?: $name) ?: 'proyecto';
        $candidate = $base;
        $i = 2;

        while (Project::where('slug', $candidate)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $candidate = "{$base}-{$i}";
            $i++;
        }

        return $candidate;
    }

    /**
     * @return list<string>|null
     */
    protected function parseFeatures(?string $text): ?array
    {
        if ($text === null) {
            return null;
        }

        $features = collect(preg_split('/\r\n|\r|\n/', $text))
            ->map(fn ($line) => trim($line))
            ->filter()
            ->values()
            ->all();

        return $features === [] ? null : $features;
    }
}
