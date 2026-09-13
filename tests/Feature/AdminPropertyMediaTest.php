<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Status;
use App\Models\User;
use App\Models\Zone;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminPropertyMediaTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $editor;

    private User $comercial;

    private Property $property;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        Storage::fake('public');

        $this->admin = $this->makeUser('admin@covesa.com', 'admin');
        $this->editor = $this->makeUser('editor@covesa.com', 'editor');
        $this->comercial = $this->makeUser('maria.contreras@covesa.com', 'comercial');

        $type = PropertyType::create(['name' => 'Terreno', 'slug' => 'terreno']);
        $zone = Zone::create(['name' => 'Zona', 'slug' => 'zona']);
        $status = Status::create(['type' => 'property', 'name' => 'En venta', 'slug' => 'en-venta']);

        $this->property = Property::create([
            'property_type_id' => $type->id,
            'zone_id' => $zone->id,
            'status_id' => $status->id,
            'title' => 'Con galería',
            'slug' => 'con-galeria',
            'operation' => 'venta',
            'area_total' => 1000,
            'currency' => 'USD',
            'price_type' => 'total',
        ]);
    }

    private function makeUser(string $email, string $role): User
    {
        $user = User::create(['name' => $role.' tester', 'email' => $email, 'password' => 'password']);
        $user->assignRole($role);

        return $user;
    }

    public function test_first_upload_becomes_featured_and_files_are_optimized(): void
    {
        $this->actingAs($this->editor)->post("/admin/propiedades/{$this->property->id}/media", [
            'photos' => [
                UploadedFile::fake()->image('a.jpg', 2000, 1500),
                UploadedFile::fake()->image('b.jpg', 800, 600),
            ],
        ])->assertSessionHasNoErrors();

        $media = $this->property->media()->orderBy('order')->get();
        $this->assertCount(2, $media);
        $this->assertSame('featured', $media[0]->type);
        $this->assertSame('gallery', $media[1]->type);

        foreach ($media as $m) {
            Storage::disk('public')->assertExists($m->path);
            $this->assertSame('image/jpeg', $m->mime_type);
        }

        // La de 2000px se redujo a máx. 1920 de ancho.
        $size = getimagesize(Storage::disk('public')->path($media[0]->path));
        $this->assertLessThanOrEqual(1920, $size[0]);

        // Helper del modelo.
        $this->assertSame($media[0]->id, $this->property->refresh()->featuredImage()->id);
    }

    public function test_set_featured_keeps_single_cover(): void
    {
        $this->actingAs($this->editor)->post("/admin/propiedades/{$this->property->id}/media", [
            'photos' => [UploadedFile::fake()->image('a.jpg'), UploadedFile::fake()->image('b.jpg')],
        ]);

        $second = $this->property->media()->orderBy('order')->get()[1];

        $this->actingAs($this->editor)
            ->patch("/admin/propiedades/{$this->property->id}/media/{$second->id}/featured")
            ->assertSessionHasNoErrors();

        $this->assertSame(1, $this->property->media()->where('type', 'featured')->count());
        $this->assertSame($second->id, $this->property->refresh()->featuredImage()->id);
    }

    public function test_reorder_updates_order_and_ignores_foreign_ids(): void
    {
        $this->actingAs($this->editor)->post("/admin/propiedades/{$this->property->id}/media", [
            'photos' => [UploadedFile::fake()->image('a.jpg'), UploadedFile::fake()->image('b.jpg')],
        ]);

        [$first, $second] = $this->property->media()->orderBy('order')->get()->all();

        $this->actingAs($this->editor)
            ->patch("/admin/propiedades/{$this->property->id}/media/reorder", [
                'ids' => [$second->id, $first->id, 999999],
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame(0, $second->refresh()->order);
        $this->assertSame(1, $first->refresh()->order);
    }

    public function test_destroy_removes_record_and_file(): void
    {
        $this->actingAs($this->editor)->post("/admin/propiedades/{$this->property->id}/media", [
            'photos' => [UploadedFile::fake()->image('a.jpg')],
        ]);

        $medium = $this->property->media()->firstOrFail();
        $path = $medium->path;

        $this->actingAs($this->editor)
            ->delete("/admin/propiedades/{$this->property->id}/media/{$medium->id}")
            ->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('media', ['id' => $medium->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_media_of_another_property_returns_404(): void
    {
        $other = Media::create([
            'mediable_id' => 999999,
            'mediable_type' => Property::class,
            'type' => 'gallery',
            'path' => 'x.jpg',
            'order' => 0,
        ]);

        $this->actingAs($this->editor)
            ->patch("/admin/propiedades/{$this->property->id}/media/{$other->id}/featured")
            ->assertNotFound();
    }

    public function test_comercial_is_forbidden_on_all_media_routes(): void
    {
        $this->actingAs($this->comercial)->post("/admin/propiedades/{$this->property->id}/media", [])
            ->assertForbidden();

        $medium = $this->property->media()->create([
            'type' => 'gallery', 'path' => 'x.jpg', 'order' => 0,
        ]);

        $this->actingAs($this->comercial)
            ->patch("/admin/propiedades/{$this->property->id}/media/{$medium->id}/featured")
            ->assertForbidden();
        $this->actingAs($this->comercial)
            ->patch("/admin/propiedades/{$this->property->id}/media/reorder", ['ids' => [$medium->id]])
            ->assertForbidden();
        $this->actingAs($this->comercial)
            ->delete("/admin/propiedades/{$this->property->id}/media/{$medium->id}")
            ->assertForbidden();
    }

    public function test_rejects_non_images_and_oversized_files(): void
    {
        $this->actingAs($this->editor)->post("/admin/propiedades/{$this->property->id}/media", [
            'photos' => [UploadedFile::fake()->create('doc.pdf', 100)],
        ])->assertSessionHasErrors('photos.0');

        $this->actingAs($this->editor)->post("/admin/propiedades/{$this->property->id}/media", [
            'photos' => [UploadedFile::fake()->create('big.jpg', 6000)],
        ])->assertSessionHasErrors('photos.0');

        $this->assertSame(0, $this->property->media()->count());
    }
}
