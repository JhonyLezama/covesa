<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Media;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlogMediaController extends Controller
{
    use AuthorizesRequests, Concerns\ManagesGallery;

    public function store(Request $request, BlogPost $post): RedirectResponse
    {
        $this->authorize('update', $post);

        return $this->storeGalleryMedia($request, $post, 'blog');
    }

    public function setFeatured(BlogPost $post, Media $media): RedirectResponse
    {
        $this->authorize('update', $post);

        return $this->setGalleryFeatured($post, $media);
    }

    public function reorder(Request $request, BlogPost $post): RedirectResponse
    {
        $this->authorize('update', $post);

        return $this->reorderGalleryMedia($request, $post);
    }

    public function destroy(BlogPost $post, Media $media): RedirectResponse
    {
        $this->authorize('update', $post);

        return $this->destroyGalleryMedia($post, $media);
    }
}
