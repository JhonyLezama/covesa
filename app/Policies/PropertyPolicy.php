<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    /**
     * Ver el listado: admin/editor (manage-content) y comercial
     * (el controlador limita su query a las asignadas).
     */
    public function viewAny(User $user): bool
    {
        return $user->can('manage-content') || $user->hasRole('comercial');
    }

    public function view(User $user, Property $property): bool
    {
        return $user->can('manage-content')
            || ($user->hasRole('comercial') && $property->assigned_user_id === $user->id);
    }

    public function create(User $user): bool
    {
        return $user->can('manage-content');
    }

    public function update(User $user, Property $property): bool
    {
        return $user->can('manage-content');
    }

    public function delete(User $user, Property $property): bool
    {
        return $user->can('manage-content');
    }

    public function restore(User $user, Property $property): bool
    {
        return $user->can('manage-content');
    }
}
