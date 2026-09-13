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
}
