<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Ver el listado: admin/editor (manage-content) y comercial
     * (solo lectura; los proyectos no tienen asesor asignado,
     * así que no hay scope por usuario como en propiedades).
     */
    public function viewAny(User $user): bool
    {
        return $user->can('manage-content') || $user->hasRole('comercial');
    }

    public function view(User $user, Project $project): bool
    {
        return $user->can('manage-content') || $user->hasRole('comercial');
    }

    public function create(User $user): bool
    {
        return $user->can('manage-content');
    }

    public function update(User $user, Project $project): bool
    {
        return $user->can('manage-content');
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->can('manage-content');
    }

    public function restore(User $user, Project $project): bool
    {
        return $user->can('manage-content');
    }
}
