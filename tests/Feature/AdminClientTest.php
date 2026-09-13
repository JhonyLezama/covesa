<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Project;
use App\Models\Status;
use App\Models\User;
use App\Models\Zone;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminClientTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $editor;

    private User $comercial;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->admin = $this->makeUser('admin@covesa.com', 'admin');
        $this->editor = $this->makeUser('editor@covesa.com', 'editor');
        $this->comercial = $this->makeUser('maria.contreras@covesa.com', 'comercial');
    }

    private function makeUser(string $email, string $role): User
    {
        $user = User::create(['name' => $role.' tester', 'email' => $email, 'password' => 'password']);
        $user->assignRole($role);

        return $user;
    }

    public function test_admin_and_editor_can_manage_clients_but_comercial_cannot(): void
    {
        $this->actingAs($this->admin)->get('/admin/clientes')->assertOk();
        $this->actingAs($this->editor)->get('/admin/clientes')->assertOk();
        $this->actingAs($this->comercial)->get('/admin/clientes')->assertForbidden();
        $this->actingAs($this->comercial)->post('/admin/clientes', ['name' => 'X'])->assertForbidden();
    }

    public function test_editor_can_create_client_with_logo(): void
    {
        Storage::fake('public');

        $this->actingAs($this->editor)->post('/admin/clientes', [
            'name' => 'Aspromermet',
            'contact_name' => 'Juan Pérez',
            'email' => 'contacto@aspromermet.pe',
            'phone' => '+51 999 888 777',
            'logo' => UploadedFile::fake()->image('logo.png', 400, 400),
        ])->assertRedirect('/admin/clientes');

        $client = Client::where('slug', 'aspromermet')->firstOrFail();

        $this->assertSame('Aspromermet', $client->name);
        $this->assertTrue($client->show_name);
        $this->assertNotNull($client->logo_path);
        $this->assertStringStartsWith('clients/', $client->logo_path);
        Storage::disk('public')->assertExists($client->logo_path);
        $this->assertNotNull($client->logoUrl());
    }

    public function test_client_name_is_required_and_slug_unique(): void
    {
        Client::create(['name' => 'Aspromermet', 'slug' => 'aspromermet']);

        $this->actingAs($this->editor)->post('/admin/clientes', ['name' => ''])
            ->assertSessionHasErrors('name');

        $this->actingAs($this->editor)->post('/admin/clientes', ['name' => 'Otro', 'slug' => 'aspromermet'])
            ->assertSessionHasErrors('slug');
    }

    public function test_project_prefers_related_client_name_over_legacy_text(): void
    {
        $zone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $status = Status::create(['type' => 'project', 'name' => 'En construcción', 'slug' => 'en-construccion']);
        $client = Client::create(['name' => 'Aspromermet', 'slug' => 'aspromermet']);

        $linked = Project::create([
            'name' => 'El Milagro', 'slug' => 'el-milagro',
            'status_id' => $status->id, 'zone_id' => $zone->id,
            'client_id' => $client->id, 'client_name' => 'Texto viejo',
            'is_published' => true,
        ]);
        $legacy = Project::create([
            'name' => 'Viejo', 'slug' => 'viejo',
            'status_id' => $status->id, 'zone_id' => $zone->id,
            'client_name' => 'Texto viejo',
            'is_published' => true,
        ]);

        $this->assertSame('Aspromermet', $linked->clientName());
        $this->assertSame('Texto viejo', $legacy->clientName());
    }

    public function test_deleting_client_nulls_project_reference_and_removes_logo(): void
    {
        Storage::fake('public');

        $client = Client::create(['name' => 'Aspromermet', 'slug' => 'aspromermet']);
        $client->logo_path = 'clients/logo_test.jpg';
        Storage::disk('public')->put('clients/logo_test.jpg', 'fake');
        $client->save();

        $zone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $status = Status::create(['type' => 'project', 'name' => 'En proceso', 'slug' => 'en-proceso']);
        $project = Project::create([
            'name' => 'Hanan', 'slug' => 'hanan',
            'status_id' => $status->id, 'zone_id' => $zone->id,
            'client_id' => $client->id, 'is_published' => true,
        ]);

        $this->actingAs($this->admin)->delete("/admin/clientes/{$client->id}")
            ->assertRedirect('/admin/clientes');

        $this->assertNull($project->fresh()->client_id);
        Storage::disk('public')->assertMissing('clients/logo_test.jpg');
    }
}
