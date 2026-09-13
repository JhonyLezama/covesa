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
            ['name' => 'Aspromermet', 'website' => null, 'order' => 1],
            ['name' => 'Inversiones SAC', 'website' => null, 'order' => 2],
            ['name' => 'Tierra Viva', 'website' => null, 'order' => 3],
            ['name' => 'Protecta Security', 'website' => null, 'order' => 4],
            ['name' => 'Carlos A. Mannucci', 'website' => null, 'order' => 5],
        ];

        foreach ($clients as $data) {
            Client::updateOrCreate(
                ['slug' => Str::slug($data['name'])],
                [...$data, 'is_active' => true]
            );
        }
    }
}
