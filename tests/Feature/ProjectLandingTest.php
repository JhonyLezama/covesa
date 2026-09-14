<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Project;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Status;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectLandingTest extends TestCase
{
    use RefreshDatabase;

    private function makeProject(string $slug = 'el-milagro'): Project
    {
        $zone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $status = Status::create(['type' => 'project', 'name' => 'En construcción', 'slug' => 'en-construccion', 'color' => '#F2A623']);

        $project = Project::create([
            'name' => 'Mercado Mayorista Ecológico El Milagro',
            'slug' => $slug,
            'status_id' => $status->id,
            'zone_id' => $zone->id,
            'is_published' => true,
        ]);
        $project->translations()->create([
            'locale' => 'es',
            'title' => 'Mercado Mayorista Ecológico El Milagro',
            'subtitle' => 'Frente al Óvalo El Milagro',
            'badge_top' => 'Mercado Mayorista Ecológico',
            'badge_title' => 'El Milagro',
            'description' => 'Con **18 hectáreas** y **1,700 puestos mayoristas**.',
            'features' => ['Zona Minorista', 'Zona Mayorista', 'Zona Financiera', 'Zona Comercial 1', 'Zona Comercial 2'],
        ]);

        Status::create(['type' => 'lead', 'name' => 'Nuevo', 'slug' => 'nuevo', 'color' => '#0C447C']);

        return $project;
    }

    public function test_landing_payload_includes_hero_brochure_and_properties(): void
    {
        $project = $this->makeProject();
        $project->media()->create([
            'type' => 'featured', 'path' => 'https://example.com/hero.jpg',
            'original_name' => 'hero.jpg', 'mime_type' => 'image/jpeg', 'order' => 0,
        ]);

        $this->get('/proyectos/el-milagro')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Show')
            ->where('project.slug', 'el-milagro')
            ->where('project.hero_image', 'https://example.com/hero.jpg')
            ->where('project.brochure_url', null)
            ->where('project.logo_url', null)
            ->where('project.badge.top', 'Mercado Mayorista Ecológico')
            ->where('project.badge.title', 'El Milagro')
            ->has('project.properties')
            ->has('project.features', 5)
        );
    }

    public function test_landing_prefers_uploaded_logo_over_text_badge(): void
    {
        $project = $this->makeProject();
        $project->media()->create([
            'type' => 'logo', 'path' => 'projects/1/logo.jpg',
            'original_name' => 'logo.jpg', 'mime_type' => 'image/jpeg', 'order' => 998,
        ]);

        $this->get('/proyectos/el-milagro')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('project.logo_url', \App\Support\MediaStorage::url('projects/1/logo.jpg'))
            ->where('project.badge.title', 'El Milagro')
        );
    }

    public function test_lead_form_stores_lead_with_extra_data(): void
    {
        $this->makeProject();

        $payload = [
            'tipo_puesto' => 'Puesto Zona Mayorista',
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'juan@example.com',
            'phone' => '+51 999 888 777',
            'document_type' => 'DNI',
            'document_number' => '12345678',
            'rubro' => 'Abarrotes',
            'accepted_data_policy' => true,
            'accepted_marketing_policy' => false,
        ];

        $this->post('/proyectos/el-milagro/leads', $payload)
            ->assertRedirect()
            ->assertSessionHas('success');

        $lead = Lead::firstOrFail();
        $this->assertSame('landing_proyecto', $lead->source);
        $this->assertSame('Juan', $lead->first_name);
        $this->assertSame('Pérez', $lead->last_name);
        $this->assertSame('DNI', $lead->document_type);
        $this->assertSame('Puesto Zona Mayorista', $lead->extra_data['tipo_puesto']);
        $this->assertSame('Abarrotes', $lead->extra_data['rubro']);
        $this->assertTrue($lead->accepted_data_policy);
    }

    public function test_lead_form_validates_required_fields(): void
    {
        $this->makeProject();

        $this->post('/proyectos/el-milagro/leads', [])
            ->assertSessionHasErrors(['tipo_puesto', 'first_name', 'last_name', 'email', 'phone', 'document_type', 'document_number', 'accepted_data_policy']);

        $this->assertSame(0, Lead::count());
    }

    public function test_carousel_lists_only_project_properties(): void
    {
        $project = $this->makeProject();
        $zone = Zone::firstOrFail();
        $type = PropertyType::create(['name' => 'Puesto', 'slug' => 'puesto']);
        $pStatus = Status::create(['type' => 'property', 'name' => 'En venta', 'slug' => 'en-venta']);

        $linked = Property::create([
            'project_id' => $project->id, 'property_type_id' => $type->id,
            'zone_id' => $zone->id, 'status_id' => $pStatus->id,
            'title' => 'Puesto 101', 'slug' => 'puesto-101', 'operation' => 'venta',
            'area_total' => 12, 'area_unit' => 'm2', 'price_type' => 'total',
            'is_published' => true, 'is_featured' => true,
        ]);

        Property::create([
            'project_id' => null, 'property_type_id' => $type->id,
            'zone_id' => $zone->id, 'status_id' => $pStatus->id,
            'title' => 'Otro', 'slug' => 'otro', 'operation' => 'venta',
            'area_total' => 50, 'area_unit' => 'm2', 'price_type' => 'total',
            'is_published' => true, 'is_featured' => true,
        ]);

        $this->get('/proyectos/el-milagro')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->has('project.properties', 1)
            ->where('project.properties.0.title', 'Puesto 101')
            ->where('project.properties.0.slug', 'puesto-101')
        );
    }
}
