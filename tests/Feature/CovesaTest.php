<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CovesaTest extends TestCase
{
    public function test_home_renders_with_properties(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('properties', 6)
        );
    }

    public function test_home_filters_by_tab(): void
    {
        $response = $this->get('/?tab=venta');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('properties', 2)
        );
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
