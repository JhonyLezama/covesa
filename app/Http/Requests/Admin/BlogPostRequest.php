<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // La BlogPostPolicy decide por método en el controlador.
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $postId = $this->route('post')?->id;

        return [
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blog_posts', 'slug')->ignore($postId)],
            // Decisión de modelo: categoría como string simple, sin tabla aparte.
            'category' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['sometimes', 'boolean'],
            // Contenido en español (único idioma hasta Semana 7).
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'published_at' => 'fecha de publicación',
            'title' => 'título (ES)',
            'excerpt' => 'extracto (ES)',
            'content' => 'contenido (ES)',
        ];
    }
}
