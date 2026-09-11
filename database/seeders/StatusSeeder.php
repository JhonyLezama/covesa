<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            // Propiedades
            ['type' => 'property', 'name' => 'En venta', 'slug' => 'en-venta', 'color' => '#F2A623', 'order' => 1],
            ['type' => 'property', 'name' => 'En alquiler', 'slug' => 'en-alquiler', 'color' => '#0C447C', 'order' => 2],
            ['type' => 'property', 'name' => 'Vendido', 'slug' => 'vendido', 'color' => '#6B6B68', 'order' => 3],
            ['type' => 'property', 'name' => 'Reservado', 'slug' => 'reservado', 'color' => '#B45309', 'order' => 4],
            // Proyectos
            ['type' => 'project', 'name' => 'En construcción', 'slug' => 'en-construccion', 'color' => '#F2A623', 'order' => 1],
            ['type' => 'project', 'name' => 'En proceso', 'slug' => 'en-proceso', 'color' => '#0C447C', 'order' => 2],
            ['type' => 'project', 'name' => 'Concluido', 'slug' => 'concluido', 'color' => '#2F8F4E', 'order' => 3],
            // Leads (mini-CRM)
            ['type' => 'lead', 'name' => 'Nuevo', 'slug' => 'nuevo', 'color' => '#0C447C', 'order' => 1],
            ['type' => 'lead', 'name' => 'Contactado', 'slug' => 'contactado', 'color' => '#F2A623', 'order' => 2],
            ['type' => 'lead', 'name' => 'En negociación', 'slug' => 'en-negociacion', 'color' => '#B45309', 'order' => 3],
            ['type' => 'lead', 'name' => 'Ganado', 'slug' => 'ganado', 'color' => '#2F8F4E', 'order' => 4],
            ['type' => 'lead', 'name' => 'Perdido', 'slug' => 'perdido', 'color' => '#6B6B68', 'order' => 5],
            // Referidos
            ['type' => 'referral', 'name' => 'Pendiente', 'slug' => 'pendiente', 'color' => '#F2A623', 'order' => 1],
            ['type' => 'referral', 'name' => 'Contactado', 'slug' => 'contactado', 'color' => '#0C447C', 'order' => 2],
            ['type' => 'referral', 'name' => 'Venta concretada', 'slug' => 'venta-concretada', 'color' => '#2F8F4E', 'order' => 3],
            ['type' => 'referral', 'name' => 'Comisión pagada', 'slug' => 'comision-pagada', 'color' => '#6B6B68', 'order' => 4],
        ];

        foreach ($statuses as $status) {
            Status::updateOrCreate(
                ['type' => $status['type'], 'slug' => $status['slug']],
                $status
            );
        }
    }
}
