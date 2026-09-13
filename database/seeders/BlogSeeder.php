<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::where('email', 'editor@covesa.com')->firstOrFail();

        $post = BlogPost::updateOrCreate(
            ['slug' => 'nuevo-puente-el-milagro'],
            [
                'author_id' => $author->id,
                'category' => 'Noticias de Moche',
                'is_published' => true,
                'published_at' => now(),
            ]
        );
        $post->translations()->updateOrCreate(
            ['locale' => 'es'],
            [
                'title' => 'Nuevo Puente El Milagro',
                'excerpt' => 'Nueva infraestructura que impulsa la zona de El Milagro.',
                'content' => '<p>Contenido de prueba del blog COVESA.</p>',
            ]
        );

        // Portada externa demo; no pisar si el editor ya subió imágenes.
        if (! $post->media()->exists()) {
            $post->media()->create([
                'type' => 'featured',
                'path' => 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200&q=80',
                'original_name' => 'nuevo-puente-el-milagro.jpg',
                'mime_type' => 'image/jpeg',
                'order' => 0,
                'alt_text' => 'Nuevo Puente El Milagro',
            ]);
        }
    }
}
