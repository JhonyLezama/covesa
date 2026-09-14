<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Project;
use App\Models\Status;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $enConstruccion = Status::where('type', 'project')->where('slug', 'en-construccion')->firstOrFail();
        $enProceso = Status::where('type', 'project')->where('slug', 'en-proceso')->firstOrFail();
        $concluido = Status::where('type', 'project')->where('slug', 'concluido')->firstOrFail();
        $trujillo = Zone::where('slug', 'trujillo')->firstOrFail();
        $sullana = Zone::where('slug', 'sullana')->firstOrFail();

        $projects = [
            [
                'name' => 'Mercado Mayorista Ecológico El Milagro',
                'slug' => 'el-milagro',
                'order' => 1,
                'client' => 'aspromermet',
                'status' => $enConstruccion->id,
                'zone' => $trujillo->id,
                'client_name' => 'Aspromermet',
                'service_type' => 'Project Management',
                'cover' => 'https://images.unsplash.com/photo-1777049645587-98ba4bfbe4e6?w=1600&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
                'translation' => [
                    'locale' => 'es',
                    'title' => 'Mercado Mayorista Ecológico El Milagro',
                    'subtitle' => 'Frente al Óvalo El Milagro',
                    'badge_top' => 'Mercado Mayorista Ecológico',
                    'badge_title' => 'El Milagro',
                    'description' => 'Somos el nuevo referente comercial de La Libertad. Con **18 hectáreas** estratégicamente ubicadas frente al Óvalo El Milagro, te ofrecemos más de **1,700 puestos mayoristas**, cada uno con **título de propiedad** independiente y **registro público**. Asegura tu patrimonio en un complejo sostenible con energía solar, diseño moderno y áreas financieras.',
                    'features' => ['Zona Minorista', 'Zona Mayorista', 'Zona Financiera', 'Zona Comercial 1', 'Zona Comercial 2'],
                ],
            ],
            [
                'name' => 'Hanan del Sol - Condominio Exclusivo',
                'slug' => 'hanan-del-sol',
                'order' => 2,
                'client' => 'inversiones-sac',
                'status' => $enProceso->id,
                'zone' => $trujillo->id,
                'client_name' => 'Inversiones SAC',
                'service_type' => 'Project Management',
                'cover' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
                'translation' => [
                    'locale' => 'es',
                    'title' => 'Hanan del Sol - Condominio Exclusivo',
                    'subtitle' => 'Frente a las Huacas del Sol y La Luna',
                    'description' => 'Condominio exclusivo con club house y seguridad para tu familia.',
                    'features' => ['Club House Exclusivo', 'Seguridad para tu familia', 'Áreas verdes'],
                ],
            ],
            [
                'name' => 'Hotel Tierra Viva',
                'slug' => 'hotel-tierra-viva',
                'order' => 3,
                'client' => 'tierra-viva',
                'status' => $concluido->id,
                'zone' => $trujillo->id,
                'client_name' => 'Tierra Viva',
                'service_type' => 'Adquisición de Flujos',
                'cover' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
                'translation' => [
                    'locale' => 'es',
                    'title' => 'Hotel Tierra Viva',
                    'subtitle' => 'Urb. San Andrés Etapa II',
                    'description' => 'Asesoramos a inversionistas nacionales para la **ADQUISICIÓN DE FLUJOS** como es el caso de la compra del inmueble donde funciona el **HOTEL TIERRA VIVA**.',
                    'features' => ['Ubicación céntrica', 'Alta rentabilidad', 'Operador reconocido'],
                ],
            ],
            [
                'name' => 'Protecta Security',
                'slug' => 'protecta-security',
                'order' => 4,
                'client' => 'protecta-security',
                'status' => $concluido->id,
                'zone' => $trujillo->id,
                'client_name' => 'Protecta Security',
                'service_type' => 'Gestión de Activos',
                'cover' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
                'translation' => [
                    'locale' => 'es',
                    'title' => 'Protecta Security',
                    'subtitle' => 'El Milagro, Trujillo',
                    'description' => 'Gestión integral del activo inmobiliario de Protecta Security en El Milagro, Trujillo.',
                    'features' => ['Gestión integral', 'Mantenimiento', 'Seguridad'],
                ],
            ],
            [
                'name' => 'Grupo Mannucci',
                'slug' => 'grupo-mannucci',
                'order' => 5,
                'client' => 'carlos-a-mannucci',
                'status' => $concluido->id,
                'zone' => $sullana->id,
                'client_name' => 'Carlos A. Mannucci',
                'service_type' => 'Project Management',
                'cover' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
                'gallery' => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
                'translation' => [
                    'locale' => 'es',
                    'title' => 'Grupo Mannucci',
                    'subtitle' => 'Autopista, Sullana – Piura',
                    'description' => 'Project Management del terminal industrial del Grupo Mannucci en la autopista Sullana – Piura.',
                    'features' => ['Infraestructura industrial', 'Logística', 'Expansión regional'],
                ],
            ],
        ];

        foreach ($projects as $data) {
            $project = Project::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'name' => $data['name'],
                    'status_id' => $data['status'],
                    'zone_id' => $data['zone'],
                    'client_id' => Client::where('slug', $data['client'])->first()?->id,
                    'client_name' => $data['client_name'],
                    'service_type' => $data['service_type'],
                    'order' => $data['order'],
                    'is_published' => true,
                ]
            );
            $project->translations()->updateOrCreate(
                ['locale' => 'es'],
                $data['translation']
            );

            // Solo registro + imagen alternativa externa. No pisar galería manual:
            // si la portada aún es hotlink demo (http), se refresca a la del
            // seeder; si el admin ya subió fotos reales (path local), no tocar.
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
            } else {
                $featured = $project->media()->where('type', 'featured')->first();
                if ($featured && str_starts_with($featured->path, 'http')) {
                    $featured->update(['path' => $data['cover'], 'alt_text' => $data['name']]);
                }
            }
        }
    }
}
