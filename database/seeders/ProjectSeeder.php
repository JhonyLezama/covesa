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
        }
    }
}
