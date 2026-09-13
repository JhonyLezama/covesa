<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

trait ManagesGallery
{
    /**
     * Sube varias fotos. Si el modelo aún no tiene ninguna,
     * la primera queda marcada como portada.
     */
    protected function storeGalleryMedia(Request $request, Model $parent, string $folder): RedirectResponse
    {
        $data = $request->validate([
            'photos' => ['required', 'array', 'max:10'],
            'photos.*' => ['image', 'max:5120'],
        ], [], ['photos' => 'fotos']);

        $hasAny = $parent->media()->exists();
        $order = (int) ($parent->media()->max('order') ?? -1);

        foreach ($data['photos'] as $i => $file) {
            $order++;
            $path = $this->storeGalleryPhoto($file->getRealPath(), $folder, $parent->getKey());

            $parent->media()->create([
                'type' => (! $hasAny && $i === 0) ? 'featured' : 'gallery',
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => 'image/jpeg',
                'size' => Storage::disk('public')->size($path),
                'order' => $order,
            ]);
        }

        return back()->with('success', 'Fotos subidas correctamente.');
    }

    /**
     * Marca una imagen como portada (solo puede haber una).
     */
    protected function setGalleryFeatured(Model $parent, Media $media): RedirectResponse
    {
        $this->ensureMediaBelongs($parent, $media);

        DB::transaction(function () use ($parent, $media): void {
            $parent->media()->where('type', 'featured')->update(['type' => 'gallery']);
            $media->update(['type' => 'featured']);
        });

        return back()->with('success', 'Portada actualizada.');
    }

    /**
     * Reordena la galería según el array de ids recibido.
     */
    protected function reorderGalleryMedia(Request $request, Model $parent): RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $owned = $parent->media()->pluck('id')->all();

        DB::transaction(function () use ($data, $owned): void {
            foreach (array_values($data['ids']) as $order => $id) {
                if (in_array($id, $owned, true)) {
                    Media::whereKey($id)->update(['order' => $order]);
                }
            }
        });

        return back()->with('success', 'Orden de la galería actualizado.');
    }

    /**
     * Eliminación en duro (decisión Día 4 documentada en Media):
     * registro + archivo.
     */
    protected function destroyGalleryMedia(Model $parent, Media $media): RedirectResponse
    {
        $this->ensureMediaBelongs($parent, $media);

        if (Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }
        $media->delete();

        return back()->with('success', 'Imagen eliminada.');
    }

    /**
     * Redimensiona (máx. 1920px, sin ampliar) y comprime a JPEG 82
     * para evitar fotos de 10MB sin comprimir.
     */
    protected function storeGalleryPhoto(string $realPath, string $folder, int|string $parentId): string
    {
        $image = (new ImageManager(new Driver()))->read($realPath);
        $image->scaleDown(width: 1920);

        $path = "{$folder}/{$parentId}/".uniqid('photo_', true).'.jpg';
        Storage::disk('public')->put($path, $image->toJpeg(82));

        return $path;
    }

    protected function ensureMediaBelongs(Model $parent, Media $media): void
    {
        abort_unless(
            $media->mediable_type === $parent::class && (int) $media->mediable_id === $parent->getKey(),
            404
        );
    }
}
