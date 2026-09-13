<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Support\MediaStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ClientController extends Controller
{
    /**
     * Directorio de clientes (logos + contactos). Todo editable por el
     * admin: los proyectos solo referencian vía client_id.
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('manage-content'), 403);

        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
        ]);

        $clients = Client::withCount('projects')
            ->when($validated['q'] ?? null, fn ($q, $term) => $q->where('name', 'like', "%{$term}%"))
            ->orderBy('order')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Client $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'logo_url' => $c->logoUrl(),
                'is_active' => $c->is_active,
                'projects_count' => $c->projects_count,
            ]);

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
            'filters' => ['q' => $validated['q'] ?? ''],
        ]);
    }

    public function create(): Response
    {
        abort_unless(request()->user()->can('manage-content'), 403);

        return Inertia::render('Admin/Clients/Form', ['client' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->can('manage-content'), 403);

        $data = $request->validate($this->rules());

        $client = new Client(collect($data)->except(['logo', 'slug'])->all());
        $client->slug = $this->resolveSlug($data['slug'] ?? null, $data['name']);
        if ($request->hasFile('logo')) {
            $client->logo_path = $this->storeLogo($request->file('logo'));
        }
        $client->save();

        return redirect()->route('admin.clientes.index')
            ->with('success', "Cliente {$client->name} creado correctamente.");
    }

    public function edit(Client $cliente): Response
    {
        abort_unless(request()->user()->can('manage-content'), 403);

        return Inertia::render('Admin/Clients/Form', [
            'client' => [
                'id' => $cliente->id,
                'name' => $cliente->name,
                'slug' => $cliente->slug,
                'website' => $cliente->website,
                'contact_name' => $cliente->contact_name,
                'email' => $cliente->email,
                'phone' => $cliente->phone,
                'order' => $cliente->order,
                'is_active' => $cliente->is_active,
                'show_name' => $cliente->show_name,
                'logo_url' => $cliente->logoUrl(),
            ],
        ]);
    }

    public function update(Request $request, Client $cliente): RedirectResponse
    {
        abort_unless($request->user()->can('manage-content'), 403);

        $data = $request->validate($this->rules($cliente->id));

        $cliente->fill(collect($data)->except(['logo', 'slug'])->all());
        $cliente->slug = $this->resolveSlug($data['slug'] ?? null, $data['name'], $cliente->id);
        if ($request->hasFile('logo')) {
            $this->deleteLogo($cliente->logo_path);
            $cliente->logo_path = $this->storeLogo($request->file('logo'));
        }
        $cliente->save();

        return redirect()->route('admin.clientes.index')
            ->with('success', "Cliente {$cliente->name} actualizado correctamente.");
    }

    public function destroy(Client $cliente): RedirectResponse
    {
        abort_unless(request()->user()->can('manage-content'), 403);

        $this->deleteLogo($cliente->logo_path);
        $cliente->delete();

        return redirect()->route('admin.clientes.index')
            ->with('success', "Cliente {$cliente->name} eliminado correctamente.");
    }

    /**
     * @return array<string, mixed>
     */
    protected function rules(?int $ignoreId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('clients', 'slug')->ignore($ignoreId)],
            'website' => ['nullable', 'url', 'max:500'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'show_name' => ['sometimes', 'boolean'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ];
    }

    protected function resolveSlug(?string $slug, string $name, ?int $ignoreId = null): string
    {
        $base = \Illuminate\Support\Str::slug($slug ?: $name) ?: 'cliente';
        $candidate = $base;
        $i = 2;

        while (Client::where('slug', $candidate)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $candidate = "{$base}-{$i}";
            $i++;
        }

        return $candidate;
    }

    /**
     * Logo a 512px en el disco de media (mismo patrón que avatares).
     */
    protected function storeLogo(\Illuminate\Http\UploadedFile $file): string
    {
        $image = (new ImageManager(new Driver()))->read($file->getRealPath())->scale(width: 512);

        $path = 'clients/'.uniqid('logo_', true).'.jpg';
        MediaStorage::disk()->put($path, $image->toJpeg(85));

        return $path;
    }

    protected function deleteLogo(?string $path): void
    {
        if ($path && MediaStorage::disk()->exists($path)) {
            MediaStorage::disk()->delete($path);
        }
    }
}
