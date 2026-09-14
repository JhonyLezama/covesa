<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Status;
use App\Models\User;
use App\Models\Zone;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminProjectMediaTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $editor;

    private User $comercial;

    private Project $project;

    private PropertyType $type;

    private Zone $zone;

    private Status $propertyStatus;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        Storage::fake('public');

        $this->admin = $this->makeUser('admin@covesa.com', 'admin');
        $this->editor = $this->makeUser('editor@covesa.com', 'editor');
        $this->comercial = $this->makeUser('maria.contreras@covesa.com', 'comercial');

        $this->zone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $projectStatus = Status::create(['type' => 'project', 'name' => 'En construcción', 'slug' => 'en-construccion']);

        $this->project = Project::create([
            'name' => 'Hanan del Sol', 'slug' => 'hanan-del-sol',
            'status_id' => $projectStatus->id, 'zone_id' => $this->zone->id,
        ]);
        $this->project->translations()->create([
            'locale' => 'es', 'title' => 'Hanan del Sol', 'description' => 'Condominio.',
        ]);

        $this->type = PropertyType::create(['name' => 'Terreno', 'slug' => 'terreno']);
        $this->propertyStatus = Status::create(['type' => 'property', 'name' => 'En venta', 'slug' => 'en-venta']);
    }

    private function makeUser(string $email, string $role): User
    {
        $user = User::create(['name' => $role.' tester', 'email' => $email, 'password' => 'password']);
        $user->assignRole($role);

        return $user;
    }

    private function makeProperty(array $overrides = []): Property
    {
        return Property::create(array_merge([
            'property_type_id' => $this->type->id,
            'zone_id' => $this->zone->id,
            'status_id' => $this->propertyStatus->id,
            'title' => 'Lote '.uniqid(),
            'slug' => 'lote-'.uniqid(),
            'operation' => 'venta',
            'area_total' => 500,
            'currency' => 'USD',
            'price_type' => 'total',
        ], $overrides));
    }

    public function test_project_gallery_upload_featured_reorder_and_delete(): void
    {
        $this->actingAs($this->editor)->post("/admin/proyectos/{$this->project->id}/media", [
            'photos' => [UploadedFile::fake()->image('a.jpg'), UploadedFile::fake()->image('b.jpg')],
        ])->assertSessionHasNoErrors();

        $media = $this->project->media()->orderBy('order')->get();
        $this->assertCount(2, $media);
        $this->assertSame('featured', $media[0]->type);
        $this->assertSame($media[0]->id, $this->project->refresh()->featuredImage()->id);
        $this->assertStringStartsWith("projects/{$this->project->id}/", $media[0]->path);

        // Cambiar portada a la segunda.
        $this->actingAs($this->editor)
            ->patch("/admin/proyectos/{$this->project->id}/media/{$media[1]->id}/featured")
            ->assertSessionHasNoErrors();
        $this->assertSame($media[1]->id, $this->project->refresh()->featuredImage()->id);

        // Reordenar.
        $this->actingAs($this->editor)
            ->patch("/admin/proyectos/{$this->project->id}/media/reorder", ['ids' => [$media[1]->id, $media[0]->id]])
            ->assertSessionHasNoErrors();
        $this->assertSame(0, $media[1]->refresh()->order);

        // Eliminar borra registro + archivo.
        $path = $media[0]->path;
        $this->actingAs($this->editor)
            ->delete("/admin/proyectos/{$this->project->id}/media/{$media[0]->id}")
            ->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('media', ['id' => $media[0]->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_project_logo_upload_replaces_previous(): void
    {
        $this->actingAs($this->editor)->post("/admin/proyectos/{$this->project->id}/logo", [
            'logo' => UploadedFile::fake()->image('logo.png'),
        ])->assertSessionHasNoErrors();

        $logo = $this->project->media()->where('type', 'logo')->firstOrFail();
        $this->assertStringStartsWith("projects/{$this->project->id}/", $logo->path);
        Storage::disk('public')->assertExists($logo->path);

        // Subir otro reemplaza al anterior (registro + archivo).
        $oldPath = $logo->path;
        $this->actingAs($this->editor)->post("/admin/proyectos/{$this->project->id}/logo", [
            'logo' => UploadedFile::fake()->image('logo2.png'),
        ])->assertSessionHasNoErrors();

        $this->assertSame(1, $this->project->media()->where('type', 'logo')->count());
        Storage::disk('public')->assertMissing($oldPath);

        // El comercial no puede subir logo.
        $this->actingAs($this->comercial)->post("/admin/proyectos/{$this->project->id}/logo", [
            'logo' => UploadedFile::fake()->image('logo3.png'),
        ])->assertForbidden();
    }

    public function test_project_media_rejects_other_parents_media_and_comercial(): void
    {
        $other = $this->project->media()->create(['type' => 'gallery', 'path' => 'x.jpg', 'order' => 0]);

        $property = $this->makeProperty();

        // Un media de propiedad no opera bajo rutas de proyecto.
        $this->actingAs($this->editor)
            ->patch("/admin/proyectos/{$this->project->id}/media/{$other->id}/featured")
            ->assertSessionHasNoErrors(); // mismo padre: ok
        $this->actingAs($this->editor)
            ->delete("/admin/propiedades/{$property->id}/media/{$other->id}")
            ->assertNotFound(); // otro padre: 404

        // Comercial: 403 en todo lo de galería de proyectos.
        $this->actingAs($this->comercial)->post("/admin/proyectos/{$this->project->id}/media", [])
            ->assertForbidden();
        $this->actingAs($this->comercial)
            ->delete("/admin/proyectos/{$this->project->id}/media/{$other->id}")
            ->assertForbidden();
    }

    public function test_project_show_lists_associated_properties(): void
    {
        $mine = $this->makeProperty(['project_id' => $this->project->id, 'title' => 'Lote Hanan 1']);
        $other = $this->makeProperty(['title' => 'Lote suelto']);

        $this->actingAs($this->editor)->get("/admin/proyectos/{$this->project->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Show')
                ->where('project.name', 'Hanan del Sol')
                ->has('properties', 1)
                ->where('properties.0.title', 'Lote Hanan 1')
            );

        // Comercial también puede ver el detalle (solo lectura).
        $this->actingAs($this->comercial)->get("/admin/proyectos/{$this->project->id}")->assertOk();

        $this->assertTrue($other->refresh()->project_id === null);
        $this->assertSame($this->project->id, $mine->refresh()->project_id);
    }

    public function test_property_can_be_associated_to_project_from_its_form(): void
    {
        $property = $this->makeProperty();

        $this->actingAs($this->editor)->put("/admin/propiedades/{$property->id}", [
            'property_type_id' => $this->type->id,
            'zone_id' => $this->zone->id,
            'status_id' => $this->propertyStatus->id,
            'project_id' => $this->project->id,
            'title' => $property->title,
            'slug' => $property->slug,
            'operation' => 'venta',
            'area_total' => 500,
            'area_unit' => 'm2',
            'currency' => 'USD',
            'price_type' => 'total',
        ])->assertRedirect('/admin/propiedades');

        $this->assertSame($this->project->id, $property->refresh()->project_id);
        $this->assertTrue($this->project->properties()->whereKey($property->id)->exists());
    }
}
