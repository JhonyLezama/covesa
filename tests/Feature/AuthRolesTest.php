<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthRolesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    private function makeUser(string $email, string $role, bool $active = true): User
    {
        $user = User::create([
            'name' => $role.' tester',
            'email' => $email,
            'password' => 'password',
            'is_active' => $active,
        ]);
        $user->assignRole($role);

        return $user;
    }

    public function test_guest_is_redirected_from_admin_to_login(): void
    {
        $this->get('/admin')->assertRedirect('/login');
    }

    public function test_login_screen_renders(): void
    {
        $this->get('/login')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Auth/Login'));
    }

    public function test_admin_can_login_and_sees_dashboard_with_permissions(): void
    {
        $this->makeUser('admin@covesa.com', 'admin');

        $this->post('/login', ['email' => 'admin@covesa.com', 'password' => 'password'])
            ->assertRedirect('/admin');

        $this->assertAuthenticated();

        $this->get('/admin')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('auth.user.email', 'admin@covesa.com')
                ->where('auth.user.roles', ['admin'])
                ->where('auth.user.permissions', ['manage-content', 'manage-leads', 'manage-own-leads', 'manage-settings', 'manage-users'])
            );
    }

    public function test_editor_has_only_manage_content(): void
    {
        $user = $this->makeUser('editor@covesa.com', 'editor');

        $this->assertTrue($user->can('manage-content'));
        $this->assertFalse($user->can('manage-users'));
        $this->assertFalse($user->can('manage-own-leads'));
    }

    public function test_comercial_has_only_manage_own_leads(): void
    {
        $user = $this->makeUser('maria.contreras@covesa.com', 'comercial');

        $this->assertTrue($user->can('manage-own-leads'));
        $this->assertFalse($user->can('manage-content'));
        $this->assertFalse($user->can('manage-leads'));
    }

    public function test_inactive_user_cannot_login(): void
    {
        $this->makeUser('off@covesa.com', 'editor', active: false);

        $this->post('/login', ['email' => 'off@covesa.com', 'password' => 'password'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_wrong_credentials_fail(): void
    {
        $this->makeUser('admin@covesa.com', 'admin');

        $this->post('/login', ['email' => 'admin@covesa.com', 'password' => 'wrong'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_logout_invalidates_session(): void
    {
        $this->makeUser('admin@covesa.com', 'admin');

        $this->post('/login', ['email' => 'admin@covesa.com', 'password' => 'password']);
        $this->assertAuthenticated();

        $this->post('/logout')->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_no_public_registration_route(): void
    {
        $this->get('/register')->assertNotFound();
        $this->post('/register', ['email' => 'x@x.com'])->assertNotFound();
    }
}
