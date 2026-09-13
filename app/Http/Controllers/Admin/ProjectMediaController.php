<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Project;
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
