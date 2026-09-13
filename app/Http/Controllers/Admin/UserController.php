<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\MediaStorage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);
        $validated = $request->validate([
            'role' => ['nullable', 'string', Rule::in(['admin', 'editor', 'comercial'])],
            'status' => ['nullable', 'string', Rule::in(['activo', 'inactivo'])],
        ]);

        $users = User::with('roles')
            ->when($validated['role'] ?? null, fn ($q, $role) => $q->role($role))
            ->when($validated['status'] ?? null, fn ($q, $status) => $q->where('is_active', $status === 'activo'))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'photo' => $user->photo,
                'position' => $user->position,
                'is_active' => $user->is_active,
                'roles' => $user->roles->pluck('name')->values()->all(),
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'role' => $validated['role'] ?? '',
                'status' => $validated['status'] ?? '',
            ],
            'roles' => Role::orderBy('name')->pluck('name')->all(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('Admin/Users/Form', [
            'user' => null,
            'roles' => Role::orderBy('name')->pluck('name')->all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:50'],
            'position' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'role' => ['required', 'string', Rule::in(['admin', 'editor', 'comercial'])],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $user = new User([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'phone' => $data['phone'] ?? null,
            'position' => $data['position'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if ($request->hasFile('photo')) {
            $user->photo = $this->storeAvatar($request->file('photo'));
        }

        $user->save();
        $user->assignRole($data['role']);

        return redirect()->route('admin.usuarios.index')
            ->with('success', "Usuario {$user->name} creado correctamente.");
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('Admin/Users/Form', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'photo' => $user->photo,
                'position' => $user->position,
                'is_active' => $user->is_active,
                'role' => $user->roles->first()?->name,
            ],
            'roles' => Role::orderBy('name')->pluck('name')->all(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:50'],
            'position' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'role' => ['required', 'string', Rule::in(['admin', 'editor', 'comercial'])],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->user()->is($user) && ($data['is_active'] ?? true) === false) {
            return back()->with('error', 'No puedes desactivar tu propio usuario.');
        }

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'position' => $data['position'] ?? null,
        ]);

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        if (array_key_exists('is_active', $data)) {
            $user->is_active = $data['is_active'];
        }

        if ($request->hasFile('photo')) {
            $this->deleteAvatar($user->photo);
            $user->photo = $this->storeAvatar($request->file('photo'));
        }

        $user->save();
        $user->syncRoles([$data['role']]);

        return redirect()->route('admin.usuarios.index')
            ->with('success', "Usuario {$user->name} actualizado correctamente.");
    }

    /**
     * Desactivar/activar sin eliminar: preserva el historial
     * de leads y propiedades asignadas.
     */
    public function toggleActive(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        if ($request->user()->is($user)) {
            return back()->with('error', 'No puedes desactivar tu propio usuario.');
        }

        $user->update(['is_active' => ! $user->is_active]);

        $state = $user->is_active ? 'activado' : 'desactivado';

        return back()->with('success', "Usuario {$user->name} {$state} correctamente.");
    }

    /**
     * Eliminación lógica (SoftDeletes): el registro y su historial se conservan.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        if ($request->user()->is($user)) {
            return back()->with('error', 'No puedes eliminar tu propio usuario.');
        }

        $user->delete();

        return redirect()->route('admin.usuarios.index')
            ->with('success', "Usuario {$user->name} eliminado correctamente.");
    }

    /**
     * Redimensiona el avatar a 512px y lo guarda en el disco de media.
     */
    protected function storeAvatar(\Illuminate\Http\UploadedFile $file): string
    {
        $manager = new ImageManager(new Driver());
        $image = $manager->read($file->getRealPath())->scale(width: 512);

        $path = 'avatars/'.uniqid('avatar_', true).'.jpg';
        MediaStorage::disk()->put($path, $image->toJpeg(85));

        return $path;
    }

    protected function deleteAvatar(?string $path): void
    {
        if ($path && MediaStorage::disk()->exists($path)) {
            MediaStorage::disk()->delete($path);
        }
    }
}
