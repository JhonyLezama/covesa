<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'source', 'property_id', 'project_id', 'referral_id',
        'assigned_user_id', 'status_id', 'first_name', 'last_name',
        'document_type', 'document_number', 'email', 'phone', 'location',
        'message', 'extra_data', 'attachments',
        'accepted_data_policy', 'accepted_marketing_policy', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'extra_data' => 'array',
            'attachments' => 'array',
            'accepted_data_policy' => 'boolean',
            'accepted_marketing_policy' => 'boolean',
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function referral(): BelongsTo
    {
        return $this->belongsTo(Referral::class);
    }

    public function advisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }
}
