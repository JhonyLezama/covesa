<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Referral;
use App\Models\Status;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminReferralTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $editor;

    private User $comercial;

    private Status $pendiente;

    private Status $ventaConcretada;

    private Status $leadNuevo;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->admin = $this->makeUser('admin@covesa.com', 'admin');
        $this->editor = $this->makeUser('editor@covesa.com', 'editor');
        $this->comercial = $this->makeUser('maria.contreras@covesa.com', 'comercial');

        $this->pendiente = Status::create(['type' => 'referral', 'name' => 'Pendiente', 'slug' => 'pendiente']);
        $this->ventaConcretada = Status::create(['type' => 'referral', 'name' => 'Venta concretada', 'slug' => 'venta-concretada']);
        $this->leadNuevo = Status::create(['type' => 'lead', 'name' => 'Nuevo', 'slug' => 'nuevo']);
    }

    private function makeUser(string $email, string $role): User
    {
        $user = User::create(['name' => $role.' tester', 'email' => $email, 'password' => 'password']);
        $user->assignRole($role);

        return $user;
    }

    private function makeReferral(array $overrides = []): Referral
    {
        return Referral::create(array_merge([
            'referrer_name' => 'Juan Pérez',
            'referrer_email' => 'juan@example.com',
            'referrer_phone' => '+51 999 111 222',
            'referred_name' => 'Carlos Ruiz',
            'referred_phone' => '+51 999 333 444',
            'code' => 'REF-'.uniqid(),
            'status_id' => $this->pendiente->id,
            'commission_percentage' => 5,
        ], $overrides));
    }

    public function test_admin_lists_and_filters_referrals(): void
    {
        $this->makeReferral(['code' => 'AAA']);
        $this->makeReferral(['code' => 'BBB', 'status_id' => $this->ventaConcretada->id]);

        $this->actingAs($this->admin)->get('/admin/referidos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Referrals/Index')
                ->has('referrals.data', 2)
            );

        $this->actingAs($this->admin)->get('/admin/referidos?q=BBB')
            ->assertInertia(fn (Assert $page) => $page->has('referrals.data', 1)->where('referrals.data.0.code', 'BBB'));

        $this->actingAs($this->admin)->get("/admin/referidos?status_id={$this->ventaConcretada->id}")
            ->assertInertia(fn (Assert $page) => $page->has('referrals.data', 1));
    }

    public function test_show_displays_generated_leads(): void
    {
        $referral = $this->makeReferral();
        Lead::create([
            'source' => 'refiere_y_gana',
            'referral_id' => $referral->id,
            'status_id' => $this->leadNuevo->id,
            'first_name' => 'Carlos',
            'email' => 'carlos@example.com',
            'phone' => '+51 999 333 444',
        ]);

        $this->actingAs($this->admin)->get("/admin/referidos/{$referral->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Referrals/Show')
                ->has('leads', 1)
                ->where('leads.0.name', 'Carlos')
            );
    }

    public function test_admin_registers_commission_with_auto_calculation(): void
    {
        $referral = $this->makeReferral();

        $this->actingAs($this->admin)->patch("/admin/referidos/{$referral->id}/commission", [
            'sale_amount' => 100000,
            'commission_percentage' => 5,
            'commission_paid_at' => '2026-09-10',
        ])->assertSessionHasNoErrors();

        $referral->refresh();
        $this->assertEquals(5000, $referral->commission_amount);
        $this->assertNotNull($referral->commission_paid_at);
    }

    public function test_status_must_be_of_type_referral(): void
    {
        $referral = $this->makeReferral();

        $this->actingAs($this->admin)
            ->patch("/admin/referidos/{$referral->id}/status", ['status_id' => $this->leadNuevo->id])
            ->assertSessionHasErrors('status_id');
    }

    public function test_comercial_sees_only_own_referrals_and_cannot_touch_commission(): void
    {
        $mine = $this->makeReferral(['referrer_user_id' => $this->comercial->id]);
        $other = $this->makeReferral();

        $this->actingAs($this->comercial)->get('/admin/referidos')
            ->assertInertia(fn (Assert $page) => $page->has('referrals.data', 1));

        $this->actingAs($this->comercial)->get("/admin/referidos/{$mine->id}")->assertOk();
        $this->actingAs($this->comercial)->get("/admin/referidos/{$other->id}")->assertForbidden();

        // Puede cambiar estado del suyo, pero no tocar comisión.
        $this->actingAs($this->comercial)
            ->patch("/admin/referidos/{$mine->id}/status", ['status_id' => $this->ventaConcretada->id])
            ->assertSessionHasNoErrors();
        $this->actingAs($this->comercial)
            ->patch("/admin/referidos/{$mine->id}/commission", ['commission_percentage' => 10])
            ->assertForbidden();
    }

    public function test_editor_has_no_access_to_referrals(): void
    {
        $referral = $this->makeReferral();

        $this->actingAs($this->editor)->get('/admin/referidos')->assertForbidden();
        $this->actingAs($this->editor)->get("/admin/referidos/{$referral->id}")->assertForbidden();
    }

    public function test_guest_is_redirected_from_referral_admin(): void
    {
        $this->get('/admin/referidos')->assertRedirect('/login');
    }
}
