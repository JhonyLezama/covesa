<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTranslation extends Model
{
    protected $fillable = [
        'project_id', 'locale', 'title', 'subtitle',
        'badge_top', 'badge_title',
        'description', 'features', 'meta_title', 'meta_description',
    ];

    protected function casts(): array
    {
        return ['features' => 'array'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
