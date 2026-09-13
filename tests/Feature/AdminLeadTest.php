<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Status;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminLeadTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $editor;

    private User $comercial;

    private User $otherComercial;

    private Status $nuevo;

    private Status $contactado;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->admin = $this->makeUser('admin@covesa.com', 'admin');
        $this->editor = $this->makeUser('editor@covesa.com', 'editor');
        $this->comercial = $this->makeUser('maria.contreras@covesa.com', 'comercial');
        $this->otherComercial = $this->makeUser('otro@covesa.com', 'comercial');

        $this->nuevo = Status::create(['type' => 'lead', 'name' => 'Nuevo', 'slug' => 'nuevo']);
        $this->contactado = Status::create(['type' => 'lead', 'name' => 'Contactado', 'slug' => 'contactado']);
    }

    private function makeUser(string $email, string $role): User
    {
        $user = User::create(['name' => $role.' tester', 'email' => $email, 'password' => 'password']);
        $user->assignRole($role);

        return $user;
    }

    private function makeLead(array $overrides = []): Lead
    {
        return Lead::create(array_merge([
            'source' => 'contacto',
            'status_id' => $this->nuevo->id,
            'first_name' => 'Pedro',
            'last_name' => 'Gonzales',
            'email' => 'lead'.uniqid().'@example.com',
            'phone' => '+51 999 000 111',
        ], $overrides));
    }

    public function test_admin_sees_all_leads_with_filters(): void
    {
        $this->makeLead(['assigned_user_id' => $this->comercial->id]);
        $this->makeLead(['source' => 'vende_tu_propiedad', 'status_id' => $this->contactado->id]);

        $this->actingAs($this->admin)->get('/admin/leads')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Leads/Index')
                ->has('leads.data', 2)
                ->where('isManager', true)
            );

        $this->actingAs($this->admin)->get("/admin/leads?status_id={$this->contactado->id}")
            ->assertInertia(fn (Assert $page) => $page->has('leads.data', 1));

        $this->actingAs($this->admin)->get('/admin/leads?source=vende_tu_propiedad')
            ->assertInertia(fn (Assert $page) => $page->has('leads.data', 1));

        $this->actingAs($this->admin)->get("/admin/leads?assigned={$this->comercial->id}")
            ->assertInertia(fn (Assert $page) => $page->has('leads.data', 1));
    }

    public function test_comercial_only_sees_assigned_leads(): void
    {
        $mine = $this->makeLead(['assigned_user_id' => $this->comercial->id]);
        $other = $this->makeLead(['assigned_user_id' => $this->otherComercial->id]);
        $unassigned = $this->makeLead();

        $this->actingAs($this->comercial)->get('/admin/leads')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('leads.data', 1)
                ->where('isManager', false)
            );

        $this->actingAs($this->comercial)->get("/admin/leads/{$mine->id}")->assertOk();
        $this->actingAs($this->comercial)->get("/admin/leads/{$other->id}")->assertForbidden();
        $this->actingAs($this->comercial)->get("/admin/leads/{$unassigned->id}")->assertForbidden();
    }

    public function test_editor_has_no_access_to_leads(): void
    {
        $lead = $this->makeLead();

        $this->actingAs($this->editor)->get('/admin/leads')->assertForbidden();
        $this->actingAs($this->editor)->get("/admin/leads/{$lead->id}")->assertForbidden();
        $this->actingAs($this->editor)->patch("/admin/leads/{$lead->id}/status", ['status_id' => $this->contactado->id])->assertForbidden();
    }

    public function test_only_admin_can_reassign(): void
    {
        $lead = $this->makeLead(['assigned_user_id' => $this->comercial->id]);

        $this->actingAs($this->admin)
            ->patch("/admin/leads/{$lead->id}/reassign", ['assigned_user_id' => $this->otherComercial->id])
            ->assertSessionHasNoErrors();

        $this->assertSame($this->otherComercial->id, $lead->refresh()->assigned_user_id);

        $this->actingAs($this->comercial)
            ->patch("/admin/leads/{$lead->id}/reassign", ['assigned_user_id' => $this->comercial->id])
            ->assertForbidden();
    }

    public function test_owner_comercial_can_change_status_of_own_lead(): void
    {
        $mine = $this->makeLead(['assigned_user_id' => $this->comercial->id]);
        $other = $this->makeLead(['assigned_user_id' => $this->otherComercial->id]);

        $this->actingAs($this->comercial)
            ->patch("/admin/leads/{$mine->id}/status", ['status_id' => $this->contactado->id])
            ->assertSessionHasNoErrors();

        $this->assertSame($this->contactado->id, $mine->refresh()->status_id);

        $this->actingAs($this->comercial)
            ->patch("/admin/leads/{$other->id}/status", ['status_id' => $this->contactado->id])
            ->assertForbidden();
    }

    public function test_status_must_be_of_type_lead(): void
    {
        $lead = $this->makeLead(['assigned_user_id' => $this->comercial->id]);
        $propertyStatus = Status::create(['type' => 'property', 'name' => 'En venta', 'slug' => 'en-venta']);

        $this->actingAs($this->admin)
            ->patch("/admin/leads/{$lead->id}/status", ['status_id' => $propertyStatus->id])
            ->assertSessionHasErrors('status_id');
    }

    public function test_guest_is_redirected_from_lead_admin(): void
    {
        $this->get('/admin/leads')->assertRedirect('/login');
    }
}
