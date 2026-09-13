<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            // Activos (obra en curso): solo logo, sin razón social hasta la entrega.
            ['name' => 'Aspromermet', 'website' => null, 'show_name' => false, 'order' => 1],
            ['name' => 'Inversiones SAC', 'website' => null, 'show_name' => false, 'order' => 2],
            // Concluidos: logo + nombre.
            ['name' => 'Tierra Viva', 'website' => null, 'show_name' => true, 'order' => 3],
            ['name' => 'Protecta Security', 'website' => null, 'show_name' => true, 'order' => 4],
            ['name' => 'Carlos A. Mannucci', 'website' => null, 'show_name' => true, 'order' => 5],
        ];

        foreach ($clients as $data) {
            Client::updateOrCreate(
                ['slug' => Str::slug($data['name'])],
                [...$data, 'is_active' => true]
            );
        }
    }
}
