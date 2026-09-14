<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // La ProjectPolicy decide por método en el controlador.
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $projectId = $this->route('proyecto')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('projects', 'slug')->ignore($projectId)],
            'status_id' => [
                'required', 'integer',
                Rule::exists('statuses', 'id')->where('type', 'project'),
            ],
            'zone_id' => ['required', 'integer', 'exists:zones,id'],
            'client_id' => ['nullable', 'integer', 'exists:clients,id'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'service_type' => ['nullable', 'string', 'max:255'],
            'video_url' => ['nullable', 'url', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
            // Contenido en español (único idioma hasta Semana 7).
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            // Esquina superior de la landing (distintivo del proyecto).
            'badge_top' => ['nullable', 'string', 'max:100'],
            'badge_title' => ['nullable', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'features_text' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'status_id' => 'estado',
            'zone_id' => 'zona',
            'client_id' => 'cliente (directorio)',
            'client_name' => 'cliente',
            'service_type' => 'tipo de servicio',
            'video_url' => 'URL del video',
            'title' => 'título (ES)',
            'subtitle' => 'subtítulo (ES)',
            'badge_top' => 'línea pequeña (ES)',
            'badge_title' => 'línea grande (ES)',
            'description' => 'descripción (ES)',
        ];
    }
}
