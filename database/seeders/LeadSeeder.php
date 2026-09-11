<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\Property;
use App\Models\Referral;
use App\Models\Status;
use App\Models\User;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    public function run(): void
    {
        $nuevo = Status::where('type', 'lead')->where('slug', 'nuevo')->firstOrFail();
        $advisor = User::where('email', 'maria.contreras@covesa.com')->first();
        $property = Property::where('slug', 'carretera-huanchaco')->first();
        $referral = Referral::where('code', 'ABC123')->first();

        Lead::updateOrCreate(
            ['email' => 'interesado@example.com'],
            [
                'source' => 'contacto',
                'property_id' => $property?->id,
                'assigned_user_id' => $advisor?->id,
                'status_id' => $nuevo->id,
                'first_name' => 'Pedro',
                'last_name' => 'Gonzales',
                'phone' => '+51 999 555 666',
                'message' => 'Me interesa el terreno de Carretera Huanchaco.',
                'accepted_data_policy' => true,
            ]
        );

        Lead::updateOrCreate(
            ['email' => 'vendedor@example.com'],
            [
                'source' => 'vende_tu_propiedad',
                'referral_id' => $referral?->id,
                'status_id' => $nuevo->id,
                'first_name' => 'Lucía',
                'last_name' => 'Fernández',
                'phone' => '+51 999 777 888',
                'location' => 'Trujillo',
                'extra_data' => [
                    'direccion_terreno' => 'Av. Larco 1525',
                    'zonificacion' => 'Comercial',
                    'precio_venta' => 50000,
                ],
                'accepted_data_policy' => true,
                'accepted_marketing_policy' => true,
            ]
        );
    }
}
