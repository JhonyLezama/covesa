<?php

namespace Database\Seeders;

use App\Models\Referral;
use App\Models\Status;
use Illuminate\Database\Seeder;

class ReferralSeeder extends Seeder
{
    public function run(): void
    {
        $status = Status::where('type', 'referral')->where('slug', 'pendiente')->firstOrFail();

        Referral::updateOrCreate(
            ['code' => 'ABC123'],
            [
                'referrer_name' => 'Juan Pérez',
                'referrer_email' => 'juan@example.com',
                'referrer_phone' => '+51 999 111 222',
                'referred_name' => 'Carlos Ruiz',
                'referred_email' => 'carlos@example.com',
                'referred_phone' => '+51 999 333 444',
                'status_id' => $status->id,
                'commission_percentage' => 5,
            ]
        );
    }
}
