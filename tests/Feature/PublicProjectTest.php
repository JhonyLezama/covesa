<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Status;
use App\Models\Zone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_published_project_page_renders_with_settings(): void
    {
        $zone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $status = Status::create(['type' => 'project', 'name' => 'En construcción', 'slug' => 'en-construccion']);
        \App\Models\Setting::create(['key' => 'whatsapp', 'value' => '+51 964 233 031']);

        $project = Project::create([
            'name' => 'El Milagro', 'slug' => 'el-milagro',
            'status_id' => $status->id, 'zone_id' => $zone->id, 'is_published' => true,
        ]);
        $project->translations()->create([
            'locale' => 'es', 'title' => 'El Milagro', 'description' => 'Mercado mayorista.',
        ]);

        $this->get('/proyectos/el-milagro')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Projects/Show')
            ->where('project.title', 'El Milagro')
            ->where('settings.whatsapp', '+51 964 233 031')
        );
    }

    public function test_draft_project_returns_404(): void
    {
        $zone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $status = Status::create(['type' => 'project', 'name' => 'En construcción', 'slug' => 'en-construccion']);

        Project::create([
            'name' => 'Oculto', 'slug' => 'oculto',
            'status_id' => $status->id, 'zone_id' => $zone->id, 'is_published' => false,
        ]);

        $this->get('/proyectos/oculto')->assertNotFound();
        $this->get('/proyectos/no-existe')->assertNotFound();
    }

    public function test_home_includes_settings_for_public_layout(): void
    {
        \App\Models\Setting::create(['key' => 'phone', 'value' => '+51 964 233 031']);

        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->has('settings')
            ->where('settings.phone', '+51 964 233 031')
        );
    }

    public function test_nosotros_page_renders_with_settings(): void
    {
        \App\Models\Setting::create(['key' => 'phone', 'value' => '+51 964 233 031']);

        $this->get('/nosotros')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Nosotros')
            ->where('settings.phone', '+51 964 233 031')
        );
    }

    public function test_servicios_page_renders_published_projects(): void
    {
        $zone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $status = Status::create(['type' => 'project', 'name' => 'En construcción', 'slug' => 'en-construccion', 'color' => '#F2A623']);
        $project = Project::create([
            'name' => 'El Milagro', 'slug' => 'el-milagro', 'client_name' => 'Aspromermet',
            'service_type' => 'Project Management',
            'status_id' => $status->id, 'zone_id' => $zone->id, 'is_published' => true,
        ]);
        $project->translations()->create(['locale' => 'es', 'title' => 'El Milagro', 'description' => 'Mercado mayorista.']);
        Project::create([
            'name' => 'Oculto', 'slug' => 'oculto',
            'status_id' => $status->id, 'zone_id' => $zone->id, 'is_published' => false,
        ]);

        $this->get('/servicios')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Servicios')
            ->has('projects', 1)
            ->where('projects.0.slug', 'el-milagro')
            ->where('projects.0.client_name', 'Aspromermet')
            ->where('projects.0.status.name', 'En construcción')
            ->where('projects.0.status.slug', 'en-construccion')
        );
    }

    public function test_servicios_payload_distinguishes_active_from_done(): void
    {
        $zone = Zone::create(['name' => 'Trujillo', 'slug' => 'trujillo']);
        $active = Status::create(['type' => 'project', 'name' => 'En proceso', 'slug' => 'en-proceso', 'color' => '#0C447C']);
        $done = Status::create(['type' => 'project', 'name' => 'Concluido', 'slug' => 'concluido', 'color' => '#2F8F4E']);

        foreach ([
            ['slug' => 'a1', 'status_id' => $active->id],
            ['slug' => 'a2', 'status_id' => $active->id],
            ['slug' => 'a3', 'status_id' => $active->id],
            ['slug' => 'c1', 'status_id' => $done->id],
        ] as $i => $row) {
            $p = Project::create([
                'name' => $row['slug'], 'slug' => $row['slug'],
                'status_id' => $row['status_id'], 'zone_id' => $zone->id,
                'is_published' => true, 'order' => $i + 1,
            ]);
            $p->translations()->create(['locale' => 'es', 'title' => $row['slug'], 'description' => $row['slug']]);
        }

        // 3 activos + 1 concluido: el frontend parte 2 arriba y el resto abajo.
        $this->get('/servicios')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->has('projects', 4)
            ->where('projects.0.status.slug', 'en-proceso')
            ->where('projects.3.status.slug', 'concluido')
            ->where('total', 4)
            ->where('hasMore', false)
        );
    }
}
