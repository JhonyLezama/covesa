<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class MediaStorage
{
    public static function disk(): \Illuminate\Filesystem\FilesystemAdapter
    {
        return Storage::disk((string) config('filesystems.media_disk', 'public'));
    }

    public static function url(string $path): string
    {
        // Seed demo / URLs externas (Unsplash): devolver tal cual para no
        // romperlas con "/storage/https://...". En Laravel Cloud el disco
        // es efímero, así que las portadas seed son hotlink hasta que el
        // admin suba fotos reales (path local/S3).
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // Relativa a propósito: APP_URL no siempre coincide con el host:puerto
        // real (serve en 8000/8081, XAMPP, túneles). Con "/storage/..." el
        // navegador resuelve contra el origen actual y la imagen nunca se rompe.
        return '/storage/'.ltrim($path, '/');
    }
}
