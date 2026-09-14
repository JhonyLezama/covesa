<?php

namespace Database\Seeders;

use App\Models\Project;
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
        // Lotes vinculados a El Milagro para el carrusel de la landing.
        // El resto queda sin proyecto (fallback a destacadas generales).
        $milagroId = Project::where('slug', 'el-milagro')->first()?->id;

        $properties = [
            [
                'title' => 'Carretera Huanchaco',
                'slug' => 'carretera-huanchaco',
                'type' => 'terreno-comercial',
                'zone' => 'carretera-huanchaco',
                'status' => 'en-venta',
                'operation' => 'venta',
                'project' => 'el-milagro',
                'area_total' => 6692.33,
                'ideal_for' => ['Almacenes', 'Depósitos', 'Talleres mecánicos'],
                'description' => 'Terreno comercial en plena carretera a Huanchaco, ideal para almacenes y talleres.',
                'cover' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80',
            ],
            [
                'title' => 'Barraza',
                'slug' => 'barraza',
                'type' => 'terreno-comercial',
                'zone' => 'barraza',
                'status' => 'en-venta',
                'operation' => 'venta',
                'project' => 'el-milagro',
                'area_total' => 20070,
                'lots_available' => 4,
                'description' => 'Terreno comercial con posibilidad de venta en 4 lotes.',
                'cover' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80',
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
                'cover' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
            ],
            [
                'title' => 'Av. Túpac Amaru',
                'slug' => 'av-tupac-amaru',
                'type' => 'terreno-comercial',
                'zone' => 'av-tupac-amaru',
                'status' => 'en-alquiler',
                'operation' => 'alquiler',
                'project' => 'el-milagro',
                'area_total' => 2034.81,
                'lots_available' => 3,
                'description' => 'Terreno comercial en alquiler sobre Av. Túpac Amaru.',
                'cover' => 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80',
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
                'cover' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
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
                'cover' => 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
            ],
        ];

        foreach ($properties as $data) {
            $projectId = isset($data['project'])
                ? Project::where('slug', $data['project'])->first()?->id ?? $milagroId
                : null;
            $property = Property::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'project_id' => $projectId,
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

            // Solo registro + imagen alternativa externa (hotlink). Si el admin
            // ya subió fotos manuales, no tocar la galería. Idempotente.
            if (! $property->media()->exists()) {
                $property->media()->create([
                    'type' => 'featured',
                    'path' => $data['cover'],
                    'original_name' => $data['slug'].'.jpg',
                    'mime_type' => 'image/jpeg',
                    'order' => 0,
                    'alt_text' => $data['title'],
                ]);
                $property->media()->create([
                    'type' => 'gallery',
                    'path' => $data['gallery'],
                    'original_name' => $data['slug'].'-2.jpg',
                    'mime_type' => 'image/jpeg',
                    'order' => 1,
                    'alt_text' => $data['title'],
                ]);
            }
        }
    }
}
