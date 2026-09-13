<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminBlogTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $editor;

    private User $comercial;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->admin = $this->makeUser('admin@covesa.com', 'admin');
        $this->editor = $this->makeUser('editor@covesa.com', 'editor');
        $this->comercial = $this->makeUser('maria.contreras@covesa.com', 'comercial');
    }

    private function makeUser(string $email, string $role): User
    {
        $user = User::create(['name' => $role.' tester', 'email' => $email, 'password' => 'password']);
        $user->assignRole($role);

        return $user;
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Nuevo Puente El Milagro',
            'excerpt' => 'Nueva infraestructura en la zona.',
            'content' => '<p>Contenido <strong>enriquecido</strong>.</p>',
            'category' => 'Noticias de Moche',
            'published_at' => '2026-09-01',
        ], $overrides);
    }

    public function test_editor_can_create_post_with_author_and_translation(): void
    {
        $this->actingAs($this->editor)->post('/admin/blog', $this->payload())
            ->assertRedirect('/admin/blog');

        $post = BlogPost::where('slug', 'nuevo-puente-el-milagro')->firstOrFail();
        $this->assertSame($this->editor->id, $post->author_id);
        $this->assertSame('Noticias de Moche', $post->category);

        $translation = $post->translations()->where('locale', 'es')->firstOrFail();
        $this->assertSame('Nuevo Puente El Milagro', $translation->title);
        $this->assertStringContainsString('<strong>enriquecido</strong>', $translation->content);
    }

    public function test_slug_is_made_unique_and_filters_work(): void
    {
        $this->actingAs($this->editor)->post('/admin/blog', $this->payload());
        $this->actingAs($this->editor)->post('/admin/blog', $this->payload(['category' => 'Obras']));

        $this->assertDatabaseHas('blog_posts', ['slug' => 'nuevo-puente-el-milagro-2']);

        $this->actingAs($this->editor)->get('/admin/blog?category=Obras')
            ->assertInertia(fn (Assert $page) => $page
                ->has('posts.data', 1)
                ->where('posts.data.0.category', 'Obras')
            );
    }

    public function test_store_validates_required_content(): void
    {
        $this->actingAs($this->editor)->post('/admin/blog', [
            'title' => '',
            'content' => '',
            'published_at' => 'no-fecha',
        ])->assertSessionHasErrors(['title', 'content', 'published_at']);
    }

    public function test_editor_can_update_and_soft_delete(): void
    {
        $this->actingAs($this->editor)->post('/admin/blog', $this->payload());
        $post = BlogPost::where('slug', 'nuevo-puente-el-milagro')->firstOrFail();

        $this->actingAs($this->editor)->put("/admin/blog/{$post->id}", $this->payload([
            'slug' => $post->slug,
            'title' => 'Puente El Milagro II',
        ]))->assertRedirect('/admin/blog');

        $this->assertSame('Puente El Milagro II', $post->translations()->where('locale', 'es')->first()->title);

        $this->actingAs($this->editor)->delete("/admin/blog/{$post->id}")
            ->assertRedirect('/admin/blog');

        $this->assertSoftDeleted('blog_posts', ['id' => $post->id]);
    }

    public function test_blog_gallery_upload_and_featured(): void
    {
        Storage::fake('public');
        $this->actingAs($this->editor)->post('/admin/blog', $this->payload());
        $post = BlogPost::where('slug', 'nuevo-puente-el-milagro')->firstOrFail();

        $this->actingAs($this->editor)->post("/admin/blog/{$post->id}/media", [
            'photos' => [UploadedFile::fake()->image('cover.jpg')],
        ])->assertSessionHasNoErrors();

        $this->assertSame(1, $post->media()->where('type', 'featured')->count());
        $this->assertNotNull($post->refresh()->featuredImage());
    }

    public function test_comercial_can_view_but_cannot_mutate(): void
    {
        $this->actingAs($this->editor)->post('/admin/blog', $this->payload());
        $post = BlogPost::where('slug', 'nuevo-puente-el-milagro')->firstOrFail();

        $this->actingAs($this->comercial)->get('/admin/blog')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Blog/Index')
                ->has('posts.data', 1)
                ->where('canEdit', false)
            );

        $this->actingAs($this->comercial)->get('/admin/blog/create')->assertForbidden();
        $this->actingAs($this->comercial)->post('/admin/blog', $this->payload())->assertForbidden();
        $this->actingAs($this->comercial)->get("/admin/blog/{$post->id}/edit")->assertForbidden();
        $this->actingAs($this->comercial)->put("/admin/blog/{$post->id}", $this->payload())->assertForbidden();
        $this->actingAs($this->comercial)->delete("/admin/blog/{$post->id}")->assertForbidden();
    }

    public function test_guest_is_redirected_from_blog_admin(): void
    {
        $this->get('/admin/blog')->assertRedirect('/login');
    }
}
