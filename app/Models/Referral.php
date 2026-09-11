<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

// TODO: confirmar con cliente si commission_percentage es fijo para todos
// los referidos o varía según tipo de propiedad/monto (ver base-data.txt §12).
// Si varía de forma compleja, evaluar tabla "commission_rules" en fase posterior.
class Referral extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'referrer_user_id', 'referrer_name', 'referrer_email', 'referrer_phone',
        'referred_name', 'referred_email', 'referred_phone', 'code',
        'status_id', 'property_id', 'sale_amount', 'commission_percentage',
        'commission_amount', 'commission_paid_at',
    ];

    protected function casts(): array
    {
        return ['commission_paid_at' => 'datetime'];
    }

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_user_id');
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }
}
