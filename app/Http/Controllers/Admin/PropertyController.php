<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PropertyRequest;
use App\Models\Media;
use App\Models\Project;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Status;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Property::class);

        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'operation' => ['nullable', 'string', 'in:venta,alquiler'],
            'published' => ['nullable', 'string', 'in:publicadas,borrador'],
        ]);

        $user = $request->user();

        $properties = Property::with(['type:id,name', 'zone:id,name', 'status:id,name,color', 'advisor:id,name'])
            // Comercial: solo las asignadas a él. Admin/editor: todo.
            ->when(! $user->can('manage-content'), fn ($q) => $q->where('assigned_user_id', $user->id))
            ->when($validated['q'] ?? null, fn ($q, $q2) => $q->where('title', 'like', "%{$q2}%"))
            ->when($validated['operation'] ?? null, fn ($q, $op) => $q->where('operation', $op))
            ->when($validated['published'] ?? null, fn ($q, $pub) => $q->where('is_published', $pub === 'publicadas'))
            ->orderByDesc('updated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Property $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'operation' => $p->operation,
                'area_total' => $p->area_total,
                'price' => $p->price,
                'currency' => $p->currency,
                'is_published' => $p->is_published,
                'is_featured' => $p->is_featured,
                'type' => $p->type?->name,
                'zone' => $p->zone?->name,
                'status' => $p->status ? ['name' => $p->status->name, 'color' => $p->status->color] : null,
                'advisor' => $p->advisor?->name,
            ]);

        return Inertia::render('Admin/Properties/Index', [
            'properties' => $properties,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'operation' => $validated['operation'] ?? '',
                'published' => $validated['published'] ?? '',
            ],
            'canEdit' => $user->can('manage-content'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Property::class);

        return Inertia::render('Admin/Properties/Form', [
            'property' => null,
            ...$this->catalogs(),
        ]);
    }

    public function store(PropertyRequest $request): RedirectResponse
    {
        $this->authorize('create', Property::class);

        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data['slug'] ?? null, $data['title']);

        $property = Property::create($data);

        return redirect()->route('admin.propiedades.index')
            ->with('success', "Propiedad {$property->title} creada correctamente.");
    }

    public function edit(Property $property): Response
    {
        $this->authorize('update', $property);

        return Inertia::render('Admin/Properties/Form', [
            'property' => [
                'id' => $property->id,
                'project_id' => $property->project_id,
                'property_type_id' => $property->property_type_id,
                'zone_id' => $property->zone_id,
                'status_id' => $property->status_id,
                'assigned_user_id' => $property->assigned_user_id,
                'title' => $property->title,
                'slug' => $property->slug,
                'operation' => $property->operation,
                'area_total' => $property->area_total,
                'area_unit' => $property->area_unit,
                'price' => $property->price,
                'currency' => $property->currency,
                'price_type' => $property->price_type,
                'lots_available' => $property->lots_available,
                'ideal_for' => $property->ideal_for ?? [],
                'latitude' => $property->latitude,
                'longitude' => $property->longitude,
                'address' => $property->address,
                'is_published' => $property->is_published,
                'is_featured' => $property->is_featured,
            ],
            'media' => $property->media()->orderBy('order')->get()
                ->map(fn (Media $m) => [
                    'id' => $m->id,
                    'type' => $m->type,
                    'url' => Storage::url($m->path),
                    'order' => $m->order,
                ])->all(),
            ...$this->catalogs(),
        ]);
    }

    public function update(PropertyRequest $request, Property $property): RedirectResponse
    {
        $this->authorize('update', $property);

        $data = $request->validated();
        $data['slug'] = $this->resolveSlug($data['slug'] ?? null, $data['title'], $property->id);

        $property->update($data);

        return redirect()->route('admin.propiedades.index')
            ->with('success', "Propiedad {$property->title} actualizada correctamente.");
    }

    public function destroy(Property $property): RedirectResponse
    {
        $this->authorize('delete', $property);

        $property->delete();

        return redirect()->route('admin.propiedades.index')
            ->with('success', "Propiedad {$property->title} eliminada correctamente.");
    }

    /**
     * @return array<string, mixed>
     */
    protected function catalogs(): array
    {
        return [
            'types' => PropertyType::where('is_active', true)->orderBy('order')->get(['id', 'name']),
            'zones' => Zone::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'statuses' => Status::where('type', 'property')->where('is_active', true)->orderBy('order')->get(['id', 'name']),
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'advisors' => User::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ];
    }

    protected function resolveSlug(?string $slug, string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($slug ?: $title) ?: 'propiedad';
        $candidate = $base;
        $i = 2;

        while (Property::where('slug', $candidate)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $candidate = "{$base}-{$i}";
            $i++;
        }

        return $candidate;
    }
}
