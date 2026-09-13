<?php

namespace App\Policies;

use App\Models\Referral;
use App\Models\User;

class ReferralPolicy
{
    /**
     * Mismo criterio que leads: admin (manage-leads, todos) y comercial
     * (manage-own-leads, solo los que él refirió vía referrer_user_id).
     * Editor denegado (matriz Día 1).
     */
    public function viewAny(User $user): bool
    {
        return $user->can('manage-leads') || $user->can('manage-own-leads');
    }

    public function view(User $user, Referral $referral): bool
    {
        return $user->can('manage-leads')
            || ($user->can('manage-own-leads') && $referral->referrer_user_id === $user->id);
    }

    /**
     * Cambiar estado: admin o el comercial que lo refirió.
     */
    public function updateStatus(User $user, Referral $referral): bool
    {
        return $user->can('manage-leads')
            || ($user->can('manage-own-leads') && $referral->referrer_user_id === $user->id);
    }

    /**
     * Registrar comisión (dinero): solo admin.
     */
    public function manageCommission(User $user, Referral $referral): bool
    {
        return $user->can('manage-leads');
    }
}
