<?php

namespace App\Policies;

use App\Models\Lead;
use App\Models\User;

class LeadPolicy
{
    /**
     * Bandeja: admin (manage-leads, todos) y comercial (manage-own-leads,
     * solo asignados — el controlador limita su query). Editor denegado:
     * su rol es de contenido, sin ningún permiso de leads (matriz Día 1).
     */
    public function viewAny(User $user): bool
    {
        return $user->can('manage-leads') || $user->can('manage-own-leads');
    }

    public function view(User $user, Lead $lead): bool
    {
        return $user->can('manage-leads')
            || ($user->can('manage-own-leads') && $lead->assigned_user_id === $user->id);
    }

    /**
     * Reasignar asesor: solo admin.
     */
    public function reassign(User $user, Lead $lead): bool
    {
        return $user->can('manage-leads');
    }

    /**
     * Cambiar estado: admin (cualquiera) o el comercial dueño del lead.
     */
    public function updateStatus(User $user, Lead $lead): bool
    {
        return $user->can('manage-leads')
            || ($user->can('manage-own-leads') && $lead->assigned_user_id === $user->id);
    }
}
