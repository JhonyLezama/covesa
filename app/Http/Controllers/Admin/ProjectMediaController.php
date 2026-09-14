<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Project;
use App\Support\MediaStorage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProjectMediaController extends Controller
{
    use AuthorizesRequests, Concerns\ManagesGallery;

    public function store(Request $request, Project $proyecto): RedirectResponse
    {
        $this->authorize('update', $proyecto);

        return $this->storeGalleryMedia($request, $proyecto, 'projects');
    }

    /**
     * Logo del proyecto para la esquina superior de la landing
     * (lo ideal según diseño). Solo uno vigente; si existe, manda
     * sobre el distintivo de icono + texto.
     */
    public function storeLogo(Request $request, Project $proyecto): RedirectResponse
    {
        $this->authorize('update', $proyecto);

        $data = $request->validate([
            'logo' => ['required', 'image', 'max:2048'],
        ], [], ['logo' => 'logo']);

        $file = $data['logo'];
        $path = $this->storeGalleryPhoto($file->getRealPath(), 'projects', $proyecto->getKey());

        $proyecto->media()->where('type', 'logo')->each(function (Media $m): void {
            if (MediaStorage::disk()->exists($m->path)) {
                MediaStorage::disk()->delete($m->path);
            }
            $m->delete();
        });

        $proyecto->media()->create([
            'type' => 'logo',
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => 'image/jpeg',
            'size' => MediaStorage::disk()->size($path),
            'order' => 998,
            'alt_text' => "Logo {$proyecto->name}",
        ]);

        return back()->with('success', 'Logo actualizado.');
    }

    /**
     * Brochure PDF del proyecto (descarga real en la landing).
     * Se guarda como media type=brochure (solo uno vigente).
     */
    public function storeBrochure(Request $request, Project $proyecto): RedirectResponse
    {
        $this->authorize('update', $proyecto);

        $data = $request->validate([
            'brochure' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ], [], ['brochure' => 'brochure']);

        $file = $data['brochure'];
        $path = $file->store("projects/{$proyecto->getKey()}", MediaStorage::disk());

        $proyecto->media()->where('type', 'brochure')->each(function (Media $m): void {
            if (MediaStorage::disk()->exists($m->path)) {
                MediaStorage::disk()->delete($m->path);
            }
            $m->delete();
        });

        $proyecto->media()->create([
            'type' => 'brochure',
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => 'application/pdf',
            'size' => MediaStorage::disk()->size($path),
            'order' => 999,
            'alt_text' => "Brochure {$proyecto->name}",
        ]);

        return back()->with('success', 'Brochure actualizado.');
    }

    public function setFeatured(Project $proyecto, Media $media): RedirectResponse
    {
        $this->authorize('update', $proyecto);

        return $this->setGalleryFeatured($proyecto, $media);
    }

    public function reorder(Request $request, Project $proyecto): RedirectResponse
    {
        $this->authorize('update', $proyecto);

        return $this->reorderGalleryMedia($request, $proyecto);
    }

    public function destroy(Project $proyecto, Media $media): RedirectResponse
    {
        $this->authorize('update', $proyecto);

        return $this->destroyGalleryMedia($proyecto, $media);
    }
}
