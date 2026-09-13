<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Matriz rol → permisos (guard web).
     *
     * @var array<string, list<string>>
     */
    public const ROLE_PERMISSIONS = [
        'admin' => ['manage-users', 'manage-content', 'manage-settings', 'manage-leads', 'manage-own-leads'],
        'editor' => ['manage-content'],
        'comercial' => ['manage-own-leads'],
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = collect(self::ROLE_PERMISSIONS)
            ->flatten()
            ->unique()
            ->values();

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        foreach (self::ROLE_PERMISSIONS as $role => $perms) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web'])
                ->syncPermissions($perms);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
