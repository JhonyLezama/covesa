<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Status;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $status = Status::where('type', 'project')->where('slug', 'en-construccion')->firstOrFail();
        $trujillo = Zone::where('slug', 'trujillo')->firstOrFail();

        $projects = [
            [
                'name' => 'Mercado Mayorista Ecológico El Milagro',
                'slug' => 'el-milagro',
                'client_name' => 'Aspromermet',
                'service_type' => 'Project Management',
                'cover' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
                'translation' => [
                    'locale' => 'es',
                    'title' => 'Mercado Mayorista Ecológico El Milagro',
                    'subtitle' => 'Tu oportunidad de hacer crecer tu negocio',
                    'description' => 'Proyecto mayorista ecológico desarrollado por COVESA para Aspromermet.',
                    'features' => ['Ubicación estratégica', 'Infraestructura moderna', 'Seguridad permanente'],
                ],
            ],
            [
                'name' => 'Hanan del Sol - Condominio Exclusivo',
                'slug' => 'hanan-del-sol',
                'client_name' => null,
                'service_type' => null,
                'cover' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
                'translation' => [
                    'locale' => 'es',
                    'title' => 'Hanan del Sol - Condominio Exclusivo',
                    'subtitle' => 'Vive en el lugar que siempre soñaste',
                    'description' => 'Condominio exclusivo con club house y seguridad para tu familia.',
                    'features' => ['Club House Exclusivo', 'Seguridad para tu familia', 'Áreas verdes'],
                ],
            ],
        ];

        foreach ($projects as $data) {
            $project = Project::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'name' => $data['name'],
                    'status_id' => $status->id,
                    'zone_id' => $trujillo->id,
                    'client_name' => $data['client_name'],
                    'service_type' => $data['service_type'],
                    'is_published' => true,
                ]
            );
            $project->translations()->updateOrCreate(
                ['locale' => 'es'],
                $data['translation']
            );

            // Solo registro + imagen alternativa externa. No pisar galería manual.
            if (! $project->media()->exists()) {
                $project->media()->create([
                    'type' => 'featured',
                    'path' => $data['cover'],
                    'original_name' => $data['slug'].'.jpg',
                    'mime_type' => 'image/jpeg',
                    'order' => 0,
                    'alt_text' => $data['name'],
                ]);
                $project->media()->create([
                    'type' => 'gallery',
                    'path' => $data['gallery'],
                    'original_name' => $data['slug'].'-2.jpg',
                    'mime_type' => 'image/jpeg',
                    'order' => 1,
                    'alt_text' => $data['name'],
                ]);
            }
        }
    }
}
