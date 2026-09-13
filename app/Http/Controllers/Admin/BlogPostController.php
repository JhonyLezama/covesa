<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BlogPostRequest;
use App\Models\BlogPost;
use App\Models\Media;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', BlogPost::class);

        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'published' => ['nullable', 'string', 'in:publicados,borrador'],
        ]);

        $posts = BlogPost::with(['author:id,name', 'translations' => fn ($q) => $q->where('locale', 'es')])
            ->when($validated['category'] ?? null, fn ($q, $cat) => $q->where('category', $cat))
            ->when($validated['published'] ?? null, fn ($q, $pub) => $q->where('is_published', $pub === 'publicados'))
            ->when($validated['q'] ?? null, fn ($q, $term) => $q->whereHas(
                'translations',
                fn ($t) => $t->where('locale', 'es')->where('title', 'like', "%{$term}%")
            ))
            ->orderByDesc('published_at')
            ->orderByDesc('updated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (BlogPost $p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'category' => $p->category,
                'is_published' => $p->is_published,
                'published_at' => $p->published_at?->format('d/m/Y'),
                'title' => $p->translations->first()?->title,
                'author' => $p->author?->name,
            ]);

        return Inertia::render('Admin/Blog/Index', [
            'posts' => $posts,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'category' => $validated['category'] ?? '',
                'published' => $validated['published'] ?? '',
            ],
            'categories' => BlogPost::whereNotNull('category')->distinct()->orderBy('category')->pluck('category')->all(),
            'canEdit' => $request->user()->can('manage-content'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', BlogPost::class);

        return Inertia::render('Admin/Blog/Form', [
            'post' => null,
            'categories' => BlogPost::whereNotNull('category')->distinct()->orderBy('category')->pluck('category')->all(),
        ]);
    }

    public function store(BlogPostRequest $request): RedirectResponse
    {
        $this->authorize('create', BlogPost::class);

        $data = $request->validated();

        $post = DB::transaction(function () use ($data, $request) {
            $post = BlogPost::create([
                'author_id' => $request->user()->id,
                'category' => $data['category'] ?? null,
                'slug' => $this->resolveSlug($data['slug'] ?? null, $data['title']),
                'is_published' => $data['is_published'] ?? false,
                'published_at' => $data['published_at'] ?? null,
            ]);
            $post->translations()->create([
                'locale' => 'es',
                'title' => $data['title'],
                'excerpt' => $data['excerpt'] ?? null,
                'content' => $data['content'],
            ]);

            return $post;
        });

        return redirect()->route('admin.blog.index')
            ->with('success', 'Post creado correctamente.');
    }

    public function edit(BlogPost $post): Response
    {
        $this->authorize('update', $post);

        $translation = $post->translations()->where('locale', 'es')->first();

        return Inertia::render('Admin/Blog/Form', [
            'post' => [
                'id' => $post->id,
                'slug' => $post->slug,
                'category' => $post->category,
                'published_at' => $post->published_at?->format('Y-m-d'),
                'is_published' => $post->is_published,
                'title' => $translation?->title,
                'excerpt' => $translation?->excerpt,
                'content' => $translation?->content,
            ],
            'media' => $post->media()->orderBy('order')->get()
                ->map(fn (Media $m) => [
                    'id' => $m->id,
                    'type' => $m->type,
                    'url' => Storage::url($m->path),
                    'order' => $m->order,
                ])->all(),
            'categories' => BlogPost::whereNotNull('category')->distinct()->orderBy('category')->pluck('category')->all(),
        ]);
    }

    public function update(BlogPostRequest $request, BlogPost $post): RedirectResponse
    {
        $this->authorize('update', $post);

        $data = $request->validated();

        DB::transaction(function () use ($data, $post): void {
            $post->update([
                'category' => $data['category'] ?? null,
                'slug' => $this->resolveSlug($data['slug'] ?? null, $data['title'], $post->id),
                'is_published' => $data['is_published'] ?? false,
                'published_at' => $data['published_at'] ?? null,
            ]);
            $post->translations()->updateOrCreate(
                ['locale' => 'es'],
                [
                    'title' => $data['title'],
                    'excerpt' => $data['excerpt'] ?? null,
                    'content' => $data['content'],
                ]
            );
        });

        return redirect()->route('admin.blog.index')
            ->with('success', 'Post actualizado correctamente.');
    }

    public function destroy(BlogPost $post): RedirectResponse
    {
        $this->authorize('delete', $post);

        $post->delete();

        return redirect()->route('admin.blog.index')
            ->with('success', 'Post eliminado correctamente.');
    }

    protected function resolveSlug(?string $slug, string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($slug ?: $title) ?: 'post';
        $candidate = $base;
        $i = 2;

        while (BlogPost::where('slug', $candidate)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $candidate = "{$base}-{$i}";
            $i++;
        }

        return $candidate;
    }
}
