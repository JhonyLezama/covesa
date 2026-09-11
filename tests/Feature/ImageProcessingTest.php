<?php

namespace Tests\Feature;

use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Tests\TestCase;

class ImageProcessingTest extends TestCase
{
    public function test_can_resize_an_image_with_intervention(): void
    {
        // Imagen de prueba 800x600 generada en memoria (sin archivos).
        $canvas = imagecreatetruecolor(800, 600);
        ob_start();
        imagejpeg($canvas);
        $binary = (string) ob_get_clean();
        imagedestroy($canvas);

        $manager = new ImageManager(new Driver());
        $image = $manager->read($binary);
        $image->scale(width: 400);

        $this->assertSame(400, $image->width());
        $this->assertSame(300, $image->height());
    }
}
