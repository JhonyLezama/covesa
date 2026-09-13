<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Property;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PropertyMediaController extends Controller
{
    use AuthorizesRequests, Concerns\ManagesGallery;

    public function store(Request $request, Property $property): RedirectResponse
    {
        $this->authorize('update', $property);

        return $this->storeGalleryMedia($request, $property, 'properties');
    }

    public function setFeatured(Property $property, Media $media): RedirectResponse
    {
        $this->authorize('update', $property);

        return $this->setGalleryFeatured($property, $media);
    }

    public function reorder(Request $request, Property $property): RedirectResponse
    {
        $this->authorize('update', $property);

        return $this->reorderGalleryMedia($request, $property);
    }

    public function destroy(Property $property, Media $media): RedirectResponse
    {
        $this->authorize('update', $property);

        return $this->destroyGalleryMedia($property, $media);
    }
}
