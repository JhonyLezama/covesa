<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'phone', 'value' => '+51 964 233 031', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'email', 'value' => 'informes@cvcovesa.com', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'address', 'value' => 'Av. Larco 1525 Urb. Fátima', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'whatsapp', 'value' => '+51 964 233 031', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'facebook_url', 'value' => null, 'type' => 'text', 'group' => 'social'],
            ['key' => 'instagram_url', 'value' => null, 'type' => 'text', 'group' => 'social'],
            ['key' => 'tiktok_url', 'value' => null, 'type' => 'text', 'group' => 'social'],
            ['key' => 'linkedin_url', 'value' => null, 'type' => 'text', 'group' => 'social'],
            ['key' => 'hero_overlay', 'value' => 'black', 'type' => 'select', 'group' => 'appearance'],
            ['key' => 'hero_overlay_intensity', 'value' => 'medio', 'type' => 'select', 'group' => 'appearance'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
