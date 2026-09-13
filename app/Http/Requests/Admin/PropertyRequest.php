<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // La PropertyPolicy decide por método en el controlador.
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $propertyId = $this->route('property')?->id;

        return [
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'property_type_id' => ['required', 'integer', 'exists:property_types,id'],
            'zone_id' => ['required', 'integer', 'exists:zones,id'],
            'status_id' => [
                'required', 'integer',
                Rule::exists('statuses', 'id')->where('type', 'property'),
            ],
            'assigned_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('properties', 'slug')->ignore($propertyId)],
            'operation' => ['required', Rule::in(['venta', 'alquiler'])],
            'area_total' => ['required', 'numeric', 'min:0'],
            'area_unit' => ['required', Rule::in(['m2', 'ha'])],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['required', Rule::in(['USD', 'PEN'])],
            'price_type' => ['required', Rule::in(['total', 'por_m2'])],
            'lots_available' => ['nullable', 'integer', 'min:1'],
            'ideal_for' => ['nullable', 'array'],
            'ideal_for.*' => ['string', 'max:50'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'address' => ['nullable', 'string', 'max:255'],
            'is_published' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'property_type_id' => 'tipo de propiedad',
            'zone_id' => 'zona',
            'status_id' => 'estado',
            'assigned_user_id' => 'asesor asignado',
            'title' => 'título',
            'operation' => 'operación',
            'area_total' => 'área total',
            'price_type' => 'tipo de precio',
        ];
    }
}
