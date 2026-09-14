<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Project;
use App\Models\Status;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProjectLeadController extends Controller
{
    /**
     * Formulario "Adquiere tu puesto en el mercado aquí" (El Milagro).
     * Los campos variables (tipo de puesto, rubro) van a extra_data (json),
     * según el modelo de leads definido en Semana 3.
     */
    public function store(Request $request, string $slug): RedirectResponse
    {
        $project = Project::where('slug', $slug)->where('is_published', true)->firstOrFail();

        $data = $request->validate([
            'tipo_puesto' => ['required', 'string', 'max:100'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'document_type' => ['required', 'string', 'in:DNI,RUC,CE,PAS'],
            'document_number' => ['required', 'string', 'max:30'],
            'rubro' => ['nullable', 'string', 'max:1000'],
            'accepted_data_policy' => ['accepted'],
            'accepted_marketing_policy' => ['nullable', 'boolean'],
        ], [], [
            'tipo_puesto' => 'tipo de puesto',
            'first_name' => 'nombres',
            'last_name' => 'apellidos',
            'email' => 'correo',
            'phone' => 'teléfono',
            'document_type' => 'tipo de documento',
            'document_number' => 'número de documento',
            'rubro' => 'rubro',
            'accepted_data_policy' => 'términos y condiciones',
        ]);

        $statusId = Status::where('type', 'lead')->where('slug', 'nuevo')->first()?->id;

        Lead::create([
            'source' => 'landing_proyecto',
            'project_id' => $project->id,
            'status_id' => $statusId,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'document_type' => $data['document_type'],
            'document_number' => $data['document_number'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'message' => $data['rubro'] ?? null,
            'extra_data' => [
                'tipo_puesto' => $data['tipo_puesto'],
                'rubro' => $data['rubro'] ?? null,
            ],
            'accepted_data_policy' => true,
            'accepted_marketing_policy' => (bool) ($data['accepted_marketing_policy'] ?? false),
        ]);

        return back()->with(
            'success',
            '¡Solicitud recibida! Un asesor de El Milagro se comunicará contigo a la brevedad.'
        );
    }
}
