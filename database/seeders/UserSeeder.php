<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrador COVESA',
                'email' => 'admin@covesa.com',
                'password' => 'password',
                'role' => 'admin',
            ],
            [
                'name' => 'Editor COVESA',
                'email' => 'editor@covesa.com',
                'password' => 'password',
                'role' => 'editor',
            ],
            [
                'name' => 'María Ángela Contreras',
                'email' => 'maria.contreras@covesa.com',
                'password' => 'password',
                'phone' => '+51 964 233 031',
                'position' => 'Broker corporativo',
                'role' => 'comercial',
            ],
        ];

        foreach ($users as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                collect($data)->except('role')->toArray()
            );
            $user->syncRoles([$data['role']]);
        }
    }
}
