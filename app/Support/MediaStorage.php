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
        return static::disk()->url($path);
    }
}
