<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyType;
use App\Models\Status;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $advisor = User::where('email', 'maria.contreras@covesa.com')->first();

        $properties = [
            [
                'title' => 'Carretera Huanchaco',
                'slug' => 'carretera-huanchaco',
                'type' => 'terreno-comercial',
                'zone' => 'carretera-huanchaco',
                'status' => 'en-venta',
                'operation' => 'venta',
                'area_total' => 6692.33,
                'ideal_for' => ['Almacenes', 'Depósitos', 'Talleres mecánicos'],
                'description' => 'Terreno comercial en plena carretera a Huanchaco, ideal para almacenes y talleres.',
            ],
            [
                'title' => 'Barraza',
                'slug' => 'barraza',
                'type' => 'terreno-comercial',
                'zone' => 'barraza',
                'status' => 'en-venta',
                'operation' => 'venta',
                'area_total' => 20070,
                'lots_available' => 4,
                'description' => 'Terreno comercial con posibilidad de venta en 4 lotes.',
            ],
            [
                'title' => 'Encalada',
                'slug' => 'encalada',
                'type' => 'terreno-industrial',
                'zone' => 'encalada',
                'status' => 'en-venta',
                'operation' => 'venta',
                'area_total' => 1500,
                'description' => 'Terreno industrial en zona de Encalada.',
            ],
            [
                'title' => 'Av. Túpac Amaru',
                'slug' => 'av-tupac-amaru',
                'type' => 'terreno-comercial',
                'zone' => 'av-tupac-amaru',
                'status' => 'en-alquiler',
                'operation' => 'alquiler',
                'area_total' => 2034.81,
                'lots_available' => 3,
                'description' => 'Terreno comercial en alquiler sobre Av. Túpac Amaru.',
            ],
            [
                'title' => 'Frente a Tecsup',
                'slug' => 'frente-a-tecsup',
                'type' => 'terreno-rustico',
                'zone' => 'trujillo',
                'status' => 'en-venta',
                'operation' => 'venta',
                'area_total' => 22530.61,
                'description' => 'Terreno rústico frente a Tecsup, gran extensión.',
            ],
            [
                'title' => 'Ex Fundo Larrea',
                'slug' => 'ex-fundo-larrea',
                'type' => 'local-industrial',
                'zone' => 'ex-fundo-larrea',
                'status' => 'en-alquiler',
                'operation' => 'alquiler',
                'area_total' => 4410,
                'description' => 'Local industrial en alquiler en Ex Fundo Larrea.',
            ],
        ];

        foreach ($properties as $data) {
            $property = Property::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'property_type_id' => PropertyType::where('slug', $data['type'])->firstOrFail()->id,
                    'zone_id' => Zone::where('slug', $data['zone'])->firstOrFail()->id,
                    'status_id' => Status::where('type', 'property')->where('slug', $data['status'])->firstOrFail()->id,
                    'assigned_user_id' => $advisor?->id,
                    'title' => $data['title'],
                    'operation' => $data['operation'],
                    'area_total' => $data['area_total'],
                    'price' => null, // "Consultar": visible solo vía asesor
                    'price_type' => 'total',
                    'lots_available' => $data['lots_available'] ?? null,
                    'ideal_for' => $data['ideal_for'] ?? null,
                    'is_published' => true,
                    'is_featured' => true,
                ]
            );
            $property->translations()->updateOrCreate(
                ['locale' => 'es'],
                ['description' => $data['description']]
            );
        }
    }
}
