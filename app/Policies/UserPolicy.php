<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Toda la gestión de usuarios exige el permiso granular manage-users
     * (solo rol admin según RoleSeeder). Esto bloquea por código,
     * aunque se escriba la URL directamente.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('manage-users');
    }

    public function view(User $user, User $model): bool
    {
        return $user->can('manage-users');
    }

    public function create(User $user): bool
    {
        return $user->can('manage-users');
    }

    public function update(User $user, User $model): bool
    {
        return $user->can('manage-users');
    }

    public function delete(User $user, User $model): bool
    {
        return $user->can('manage-users');
    }

    public function restore(User $user, User $model): bool
    {
        return $user->can('manage-users');
    }
}
