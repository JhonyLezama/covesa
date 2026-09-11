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
    }
}
