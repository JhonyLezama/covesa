<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

// TODO: confirmar con cliente si TODAS las propiedades requieren traducción
// o solo proyectos grandes (ver base-data.txt §7). Mientras tanto
// property_translations existe pero su uso es opcional en el CMS.
class Property extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_id', 'property_type_id', 'zone_id', 'status_id',
        'assigned_user_id', 'title', 'slug', 'operation',
        'area_total', 'area_unit', 'price', 'currency', 'price_type',
        'lots_available', 'ideal_for', 'latitude', 'longitude', 'address',
        'is_published', 'is_featured', 'views_count',
    ];

    protected function casts(): array
    {
        return [
            'ideal_for' => 'array',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class, 'property_type_id');
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function advisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(PropertyTranslation::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class);
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function featuredImage(): ?Media
    {
        return $this->media->firstWhere('type', 'featured');
    }
}
