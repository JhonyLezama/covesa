<?php

namespace Database\Seeders;

use App\Models\Zone;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    public function run(): void
    {
        $zones = [
            ['name' => 'Trujillo', 'slug' => 'trujillo', 'department' => 'La Libertad', 'order' => 1],
            ['name' => 'Huanchaco', 'slug' => 'huanchaco', 'department' => 'La Libertad', 'order' => 2],
            ['name' => 'Carretera Huanchaco', 'slug' => 'carretera-huanchaco', 'department' => 'La Libertad', 'order' => 3],
            ['name' => 'Barraza', 'slug' => 'barraza', 'department' => 'La Libertad', 'order' => 4],
            ['name' => 'Encalada', 'slug' => 'encalada', 'department' => 'La Libertad', 'order' => 5],
            ['name' => 'Av. Túpac Amaru', 'slug' => 'av-tupac-amaru', 'department' => 'La Libertad', 'order' => 6],
            ['name' => 'Ex Fundo Larrea', 'slug' => 'ex-fundo-larrea', 'department' => 'La Libertad', 'order' => 7],
            ['name' => 'Piura', 'slug' => 'piura', 'department' => 'Piura', 'order' => 8],
            ['name' => 'Sullana', 'slug' => 'sullana', 'department' => 'Piura', 'order' => 9],
        ];

        foreach ($zones as $zone) {
            Zone::updateOrCreate(['slug' => $zone['slug']], $zone);
        }
    }
}
