<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Status;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CovesaTest extends TestCase
{
    use RefreshDatabase;

    private PropertyType $type;

    private PropertyType $otherType;

    private Zone $zone;

    private Zone $otherZone;

    private Status $status;

    protected function setUp(): void
    {
        parent::setUp();

        $this->type = PropertyType::create(['name' => 'Terreno Comercial', 'slug' => 'terreno-comercial']);
        $this->otherType = PropertyType::create(['name' => 'Local Industrial', 'slug' => 'local-industrial']);
        $this->zone = Zone::create(['name' => 'Huanchaco', 'slug' => 'huanchaco']);
        $this->otherZone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $this->status = Status::create(['type' => 'property', 'name' => 'En venta', 'slug' => 'en-venta']);

        Property::create([
            'property_type_id' => $this->type->id, 'zone_id' => $this->zone->id, 'status_id' => $this->status->id,
            'title' => 'Carretera Huanchaco', 'slug' => 'carretera-huanchaco',
            'operation' => 'venta', 'area_total' => 6692.33, 'price' => 150000,
            'currency' => 'USD', 'price_type' => 'total',
            'ideal_for' => ['Almacenes'], 'is_published' => true, 'is_featured' => true,
        ]);
        Property::create([
            'property_type_id' => $this->otherType->id, 'zone_id' => $this->otherZone->id, 'status_id' => $this->status->id,
            'title' => 'Nave Trujillo', 'slug' => 'nave-trujillo',
            'operation' => 'alquiler', 'area_total' => 1000, 'price' => 8,
            'currency' => 'USD', 'price_type' => 'por_m2',
            'is_published' => true,
        ]);
        Property::create([
            'property_type_id' => $this->type->id, 'zone_id' => $this->zone->id, 'status_id' => $this->status->id,
            'title' => 'Borrador oculto', 'slug' => 'borrador-oculto',
            'operation' => 'venta', 'area_total' => 500,
            'currency' => 'USD', 'price_type' => 'total',
            'is_published' => false,
        ]);
    }

    public function test_home_renders_published_properties_with_filter_options(): void
    {
        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('properties', 2)
            ->has('filterOptions.types', 2)
            ->has('filterOptions.zones', 2)
            ->where('properties.0.title', 'Carretera Huanchaco')
            ->where('properties.0.area', '6,692.33 m²')
            ->where('properties.1.area', '1,000 m²')
        );
    }

    public function test_home_filters_by_tab(): void
    {
        $this->get('/?tab=venta')->assertInertia(fn (Assert $page) => $page
            ->has('properties', 1)
            ->where('properties.0.title', 'Carretera Huanchaco')
        );

        $this->get('/?tab=alquiler')->assertInertia(fn (Assert $page) => $page
            ->has('properties', 1)
            ->where('properties.0.title', 'Nave Trujillo')
        );
    }

    public function test_home_filters_by_type_location_price_and_search(): void
    {
        $this->get('/?type=local-industrial')->assertInertia(fn (Assert $page) => $page
            ->has('properties', 1)->where('properties.0.title', 'Nave Trujillo'));

        $this->get('/?location=trujillo')->assertInertia(fn (Assert $page) => $page
            ->has('properties', 1)->where('properties.0.title', 'Nave Trujillo'));

        $this->get('/?priceRange=100000-200000')->assertInertia(fn (Assert $page) => $page
            ->has('properties', 1)->where('properties.0.title', 'Carretera Huanchaco'));

        $this->get('/?priceRange=700000%2B')->assertInertia(fn (Assert $page) => $page
            ->has('properties', 0));

        $this->get('/?q=huanchaco')->assertInertia(fn (Assert $page) => $page
            ->has('properties', 1)->where('properties.0.title', 'Carretera Huanchaco'));
    }

    public function test_home_filters_by_purpose_and_exposes_card_data(): void
    {
        // "Almacenes y logística" casa con el tag Almacenes de Carretera Huanchaco.
        $this->get('/?purpose=almacenes')->assertInertia(fn (Assert $page) => $page
            ->has('properties', 1)
            ->where('properties.0.slug', 'carretera-huanchaco')
            ->where('properties.0.href', '/propiedades/carretera-huanchaco')
            ->where('properties.0.type', 'Terreno Comercial')
        );

        $this->get('/?purpose=residencial')->assertInertia(fn (Assert $page) => $page
            ->has('properties', 0));
    }

    public function test_contact_validates_required_fields(): void
    {
        $response = $this->post('/contacto', []);

        $response->assertSessionHasErrors(['name', 'email', 'phone']);
    }

    public function test_contact_stores_and_flashes_success(): void
    {
        $response = $this->post('/contacto', [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'phone' => '+51 999 888 777',
            'message' => 'Me interesa un departamento en San Isidro.',
        ]);

        $response->assertRedirect('/');
        $response->assertSessionHas('success');
    }
}
