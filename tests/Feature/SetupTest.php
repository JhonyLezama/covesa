<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SetupTest extends TestCase
{
    use RefreshDatabase;
    public function test_ziggy_routes_are_exposed_to_frontend(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        // La directiva @routes de Ziggy inyecta el objeto global Ziggy con las rutas nombradas.
        $response->assertSee('Ziggy', false);
        $response->assertSee('contacto.store', false);
    }
}
