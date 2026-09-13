<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $comercial;

    private User $editor;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->admin = $this->makeUser('admin@covesa.com', 'admin');
        $this->editor = $this->makeUser('editor@covesa.com', 'editor');
        $this->comercial = $this->makeUser('maria.contreras@covesa.com', 'comercial');
    }

    private function makeUser(string $email, string $role, array $overrides = []): User
    {
        $user = User::create(array_merge([
            'name' => $role.' tester',
            'email' => $email,
            'password' => 'password',
        ], $overrides));
        $user->assignRole($role);

        return $user;
    }

    public function test_guest_is_redirected_from_user_admin(): void
    {
        $this->get('/admin/usuarios')->assertRedirect('/login');
    }

    public function test_comercial_is_forbidden_on_every_user_route_even_by_direct_url(): void
    {
        $this->actingAs($this->comercial);

        $this->get('/admin/usuarios')->assertForbidden();
        $this->get('/admin/usuarios/create')->assertForbidden();
        $this->post('/admin/usuarios', [])->assertForbidden();
        $this->get("/admin/usuarios/{$this->admin->id}/edit")->assertForbidden();
        $this->put("/admin/usuarios/{$this->admin->id}", [])->assertForbidden();
        $this->patch("/admin/usuarios/{$this->admin->id}/toggle")->assertForbidden();
        $this->delete("/admin/usuarios/{$this->admin->id}")->assertForbidden();
    }

    public function test_editor_is_forbidden_on_user_admin(): void
    {
        $this->actingAs($this->editor);

        $this->get('/admin/usuarios')->assertForbidden();
        $this->post('/admin/usuarios', [])->assertForbidden();
    }

    public function test_admin_lists_users_with_role_and_status_filters(): void
    {
        $this->makeUser('off@covesa.com', 'comercial', ['is_active' => false]);

        $this->actingAs($this->admin)
            ->get('/admin/usuarios')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->has('users.data', 4)
            );

        $this->actingAs($this->admin)
            ->get('/admin/usuarios?role=comercial')
            ->assertInertia(fn (Assert $page) => $page
                ->has('users.data', 2)
            );

        $this->actingAs($this->admin)
            ->get('/admin/usuarios?status=inactivo')
            ->assertInertia(fn (Assert $page) => $page
                ->has('users.data', 1)
            );
    }

    public function test_admin_can_create_user_with_role_and_avatar(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->admin)->post('/admin/usuarios', [
            'name' => 'Nuevo Comercial',
            'email' => 'nuevo@covesa.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'phone' => '+51 999 111 222',
            'position' => 'Asesor',
            'role' => 'comercial',
            'photo' => UploadedFile::fake()->image('avatar.jpg'),
        ]);

        $response->assertRedirect('/admin/usuarios');
        $user = User::where('email', 'nuevo@covesa.com')->firstOrFail();
        $this->assertTrue($user->hasRole('comercial'));
        $this->assertNotNull($user->photo);
        Storage::disk('public')->assertExists($user->photo);
    }

    public function test_store_validates_input(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/usuarios', [
            'name' => '',
            'email' => 'admin@covesa.com',
            'password' => 'short',
            'password_confirmation' => 'short',
            'role' => 'superadmin',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'password', 'role']);
    }

    public function test_admin_can_update_user_and_sync_role_without_touching_password(): void
    {
        $target = $this->makeUser('target@covesa.com', 'comercial');
        $oldHash = $target->password;

        $this->actingAs($this->admin)->put("/admin/usuarios/{$target->id}", [
            'name' => 'Target Editado',
            'email' => 'target@covesa.com',
            'role' => 'editor',
            'phone' => '+51 111',
        ])->assertRedirect('/admin/usuarios');

        $target->refresh();
        $this->assertSame('Target Editado', $target->name);
        $this->assertTrue($target->hasRole('editor'));
        $this->assertFalse($target->hasRole('comercial'));
        $this->assertSame($oldHash, $target->password);
    }

    public function test_toggle_flips_active_state_and_preserves_record(): void
    {
        $target = $this->makeUser('target@covesa.com', 'comercial');

        $this->actingAs($this->admin)->patch("/admin/usuarios/{$target->id}/toggle")
            ->assertRedirect();

        $this->assertFalse($target->refresh()->is_active);
        $this->assertDatabaseHas('users', ['id' => $target->id, 'deleted_at' => null]);
    }

    public function test_admin_cannot_deactivate_or_delete_self(): void
    {
        $this->actingAs($this->admin)->patch("/admin/usuarios/{$this->admin->id}/toggle")
            ->assertSessionHas('error');

        $this->assertTrue($this->admin->refresh()->is_active);

        $this->actingAs($this->admin)->delete("/admin/usuarios/{$this->admin->id}")
            ->assertSessionHas('error');

        $this->assertDatabaseHas('users', ['id' => $this->admin->id, 'deleted_at' => null]);
    }

    public function test_destroy_is_soft_delete_and_preserves_history(): void
    {
        $target = $this->makeUser('target@covesa.com', 'comercial');

        $this->actingAs($this->admin)->delete("/admin/usuarios/{$target->id}")
            ->assertRedirect('/admin/usuarios');

        $this->assertSoftDeleted('users', ['id' => $target->id]);
    }
}
