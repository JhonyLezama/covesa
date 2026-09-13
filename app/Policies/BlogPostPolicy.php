<?php

namespace App\Policies;

use App\Models\BlogPost;
use App\Models\User;

class BlogPostPolicy
{
    /**
     * Mismo patrón que proyectos/propiedades: ver para manage-content
     * y comercial (solo lectura); mutar solo manage-content.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('manage-content') || $user->hasRole('comercial');
    }

    public function view(User $user, BlogPost $post): bool
    {
        return $user->can('manage-content') || $user->hasRole('comercial');
    }

    public function create(User $user): bool
    {
        return $user->can('manage-content');
    }

    public function update(User $user, BlogPost $post): bool
    {
        return $user->can('manage-content');
    }

    public function delete(User $user, BlogPost $post): bool
    {
        return $user->can('manage-content');
    }

    public function restore(User $user, BlogPost $post): bool
    {
        return $user->can('manage-content');
    }
}
