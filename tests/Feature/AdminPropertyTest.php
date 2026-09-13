<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Status;
use App\Models\User;
use App\Models\Zone;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminPropertyTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $editor;

    private User $comercial;

    private PropertyType $type;

    private Zone $zone;

    private Status $status;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->admin = $this->makeUser('admin@covesa.com', 'admin');
        $this->editor = $this->makeUser('editor@covesa.com', 'editor');
        $this->comercial = $this->makeUser('maria.contreras@covesa.com', 'comercial');

        $this->type = PropertyType::create(['name' => 'Terreno Comercial', 'slug' => 'terreno-comercial']);
        $this->zone = Zone::create(['name' => 'Huanchaco', 'slug' => 'huanchaco']);
        $this->status = Status::create(['type' => 'property', 'name' => 'En venta', 'slug' => 'en-venta']);
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
            'property_type_id' => $this->type->id,
            'zone_id' => $this->zone->id,
            'status_id' => $this->status->id,
            'title' => 'Carretera Huanchaco',
            'operation' => 'venta',
            'area_total' => 6692.33,
            'area_unit' => 'm2',
            'currency' => 'USD',
            'price_type' => 'total',
            'ideal_for' => ['Almacenes', 'Depósitos'],
        ], $overrides);
    }

    private function makeProperty(array $overrides = []): Property
    {
        return Property::create(array_merge([
            'property_type_id' => $this->type->id,
            'zone_id' => $this->zone->id,
            'status_id' => $this->status->id,
            'title' => 'Propiedad '.uniqid(),
            'slug' => 'propiedad-'.uniqid(),
            'operation' => 'venta',
            'area_total' => 1000,
            'currency' => 'USD',
            'price_type' => 'total',
        ], $overrides));
    }

    public function test_editor_can_create_property_with_auto_slug(): void
    {
        $response = $this->actingAs($this->editor)->post('/admin/propiedades', $this->payload());

        $response->assertRedirect('/admin/propiedades');
        $property = Property::where('title', 'Carretera Huanchaco')->firstOrFail();
        $this->assertSame('carretera-huanchaco', $property->slug);
        $this->assertEquals(['Almacenes', 'Depósitos'], $property->ideal_for);
    }

    public function test_slug_is_made_unique_automatically(): void
    {
        $this->actingAs($this->editor)->post('/admin/propiedades', $this->payload());
        $this->actingAs($this->editor)->post('/admin/propiedades', $this->payload());

        $this->assertDatabaseHas('properties', ['slug' => 'carretera-huanchaco']);
        $this->assertDatabaseHas('properties', ['slug' => 'carretera-huanchaco-2']);
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAs($this->editor)->post('/admin/propiedades', [
            'title' => '',
            'operation' => 'permuta',
            'status_id' => 999,
        ])->assertSessionHasErrors(['title', 'operation', 'status_id', 'property_type_id', 'zone_id', 'area_total']);
    }

    public function test_status_must_be_of_type_property(): void
    {
        $leadStatus = Status::create(['type' => 'lead', 'name' => 'Nuevo', 'slug' => 'nuevo']);

        $this->actingAs($this->editor)
            ->post('/admin/propiedades', $this->payload(['status_id' => $leadStatus->id]))
            ->assertSessionHasErrors('status_id');
    }

    public function test_editor_can_update_and_soft_delete(): void
    {
        $property = $this->makeProperty();

        $this->actingAs($this->editor)->put("/admin/propiedades/{$property->id}", $this->payload([
            'title' => 'Editada',
            'slug' => $property->slug,
        ]))->assertRedirect('/admin/propiedades');

        $this->assertSame('Editada', $property->refresh()->title);

        $this->actingAs($this->editor)->delete("/admin/propiedades/{$property->id}")
            ->assertRedirect('/admin/propiedades');

        $this->assertSoftDeleted('properties', ['id' => $property->id]);
    }

    public function test_comercial_only_sees_assigned_properties_but_cannot_mutate(): void
    {
        $mine = $this->makeProperty(['assigned_user_id' => $this->comercial->id, 'title' => 'Mía']);
        $other = $this->makeProperty(['title' => 'Ajena']);

        $this->actingAs($this->comercial)->get('/admin/propiedades')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Properties/Index')
                ->has('properties.data', 1)
                ->where('properties.data.0.title', 'Mía')
                ->where('canEdit', false)
            );

        // URL directa a las 4 rutas de mutación → 403 aunque sea su asignada.
        $this->actingAs($this->comercial)->get('/admin/propiedades/create')->assertForbidden();
        $this->actingAs($this->comercial)->post('/admin/propiedades', $this->payload())->assertForbidden();
        $this->actingAs($this->comercial)->get("/admin/propiedades/{$mine->id}/edit")->assertForbidden();
        $this->actingAs($this->comercial)->put("/admin/propiedades/{$mine->id}", $this->payload())->assertForbidden();
        $this->actingAs($this->comercial)->delete("/admin/propiedades/{$other->id}")->assertForbidden();
    }

    public function test_guest_is_redirected_from_property_admin(): void
    {
        $this->get('/admin/propiedades')->assertRedirect('/login');
    }
}
