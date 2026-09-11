<?php

namespace Database\Seeders;

use App\Models\PropertyType;
use Illuminate\Database\Seeder;

class PropertyTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Terreno Comercial', 'slug' => 'terreno-comercial', 'icon' => 'Store', 'order' => 1],
            ['name' => 'Terreno Industrial', 'slug' => 'terreno-industrial', 'icon' => 'Factory', 'order' => 2],
            ['name' => 'Terreno Rústico', 'slug' => 'terreno-rustico', 'icon' => 'Mountain', 'order' => 3],
            ['name' => 'Local Comercial', 'slug' => 'local-comercial', 'icon' => 'ShoppingBag', 'order' => 4],
            ['name' => 'Local Industrial', 'slug' => 'local-industrial', 'icon' => 'Warehouse', 'order' => 5],
        ];

        foreach ($types as $type) {
            PropertyType::updateOrCreate(['slug' => $type['slug']], $type);
        }
    }
}
