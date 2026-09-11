<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PropertyTypeSeeder::class,
            ZoneSeeder::class,
            StatusSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            ProjectSeeder::class,
            PropertySeeder::class,
            BlogSeeder::class,
            ReferralSeeder::class,
            LeadSeeder::class,
            SettingSeeder::class,
            // UiTranslation: sin datos semilla (uso real en Semana 7 multiidioma).
        ]);
    }
}
