<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Status;
use App\Models\User;
use App\Models\Zone;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminProjectTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $editor;

    private User $comercial;

    private Zone $zone;

    private Status $status;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->admin = $this->makeUser('admin@covesa.com', 'admin');
        $this->editor = $this->makeUser('editor@covesa.com', 'editor');
        $this->comercial = $this->makeUser('maria.contreras@covesa.com', 'comercial');

        $this->zone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $this->status = Status::create(['type' => 'project', 'name' => 'En construcción', 'slug' => 'en-construccion']);
    }

    private function makeUser(string $email, string $role): User
    {
        $user = User::create(['name' => $role.' tester', 'email' => $email, 'password' => 'password']);
        $user->assignRole($role);

        return $user;
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Hanan del Sol',
            'status_id' => $this->status->id,
            'zone_id' => $this->zone->id,
            'client_name' => 'Aspromermet',
            'service_type' => 'Project Management',
            'title' => 'Hanan del Sol - Condominio Exclusivo',
            'subtitle' => 'Vive donde siempre soñaste',
            'description' => 'Condominio exclusivo con club house.',
            'features_text' => "Club House Exclusivo\nSeguridad para tu familia",
        ], $overrides);
    }

    public function test_editor_can_create_project_with_spanish_translation(): void
    {
        $this->actingAs($this->editor)->post('/admin/proyectos', $this->payload())
            ->assertRedirect('/admin/proyectos');

        $project = Project::where('slug', 'hanan-del-sol')->firstOrFail();
        $translation = $project->translations()->where('locale', 'es')->firstOrFail();

        $this->assertSame('Hanan del Sol - Condominio Exclusivo', $translation->title);
        $this->assertEquals(['Club House Exclusivo', 'Seguridad para tu familia'], $translation->features);
    }

    public function test_slug_is_made_unique_automatically(): void
    {
        $this->actingAs($this->editor)->post('/admin/proyectos', $this->payload());
        $this->actingAs($this->editor)->post('/admin/proyectos', $this->payload());

        $this->assertDatabaseHas('projects', ['slug' => 'hanan-del-sol']);
        $this->assertDatabaseHas('projects', ['slug' => 'hanan-del-sol-2']);
    }

    public function test_store_validates_and_rejects_wrong_status_type(): void
    {
        $leadStatus = Status::create(['type' => 'lead', 'name' => 'Nuevo', 'slug' => 'nuevo']);

        $this->actingAs($this->editor)->post('/admin/proyectos', [
            'name' => '',
            'status_id' => $leadStatus->id,
            'title' => '',
            'description' => '',
        ])->assertSessionHasErrors(['name', 'status_id', 'zone_id', 'title', 'description']);
    }

    public function test_editor_can_update_translation_and_soft_delete(): void
    {
        $this->actingAs($this->editor)->post('/admin/proyectos', $this->payload());
        $project = Project::where('slug', 'hanan-del-sol')->firstOrFail();

        $this->actingAs($this->editor)->put("/admin/proyectos/{$project->id}", $this->payload([
            'name' => 'Hanan del Sol II',
            'slug' => $project->slug,
            'description' => 'Descripción actualizada.',
        ]))->assertRedirect('/admin/proyectos');

        $project->refresh();
        $this->assertSame('Hanan del Sol II', $project->name);
        $this->assertSame('Descripción actualizada.', $project->translations()->where('locale', 'es')->first()->description);
        $this->assertSame(1, $project->translations()->count());

        $this->actingAs($this->editor)->delete("/admin/proyectos/{$project->id}")
            ->assertRedirect('/admin/proyectos');

        $this->assertSoftDeleted('projects', ['id' => $project->id]);
    }

    public function test_corner_badge_texts_persist_on_create_and_update(): void
    {
        $this->actingAs($this->editor)->post('/admin/proyectos', $this->payload([
            'badge_top' => 'Mercado Mayorista Ecológico',
            'badge_title' => 'El Milagro',
        ]))->assertRedirect('/admin/proyectos');

        $project = Project::where('slug', 'hanan-del-sol')->firstOrFail();
        $translation = $project->translations()->where('locale', 'es')->firstOrFail();
        $this->assertSame('Mercado Mayorista Ecológico', $translation->badge_top);
        $this->assertSame('El Milagro', $translation->badge_title);

        $this->actingAs($this->editor)->put("/admin/proyectos/{$project->id}", $this->payload([
            'slug' => $project->slug,
            'badge_top' => 'Condominio Exclusivo',
            'badge_title' => 'Hanan',
        ]))->assertRedirect('/admin/proyectos');

        $translation->refresh();
        $this->assertSame('Condominio Exclusivo', $translation->badge_top);
        $this->assertSame('Hanan', $translation->badge_title);
    }

    public function test_comercial_can_view_but_cannot_mutate(): void
    {
        $this->actingAs($this->editor)->post('/admin/proyectos', $this->payload());
        $project = Project::where('slug', 'hanan-del-sol')->firstOrFail();

        $this->actingAs($this->comercial)->get('/admin/proyectos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Index')
                ->has('projects.data', 1)
                ->where('canEdit', false)
            );

        $this->actingAs($this->comercial)->get('/admin/proyectos/create')->assertForbidden();
        $this->actingAs($this->comercial)->post('/admin/proyectos', $this->payload())->assertForbidden();
        $this->actingAs($this->comercial)->get("/admin/proyectos/{$project->id}/edit")->assertForbidden();
        $this->actingAs($this->comercial)->put("/admin/proyectos/{$project->id}", $this->payload())->assertForbidden();
        $this->actingAs($this->comercial)->delete("/admin/proyectos/{$project->id}")->assertForbidden();
    }

    public function test_guest_is_redirected_from_project_admin(): void
    {
        $this->get('/admin/proyectos')->assertRedirect('/login');
    }
}
