<?php

namespace App\Models;

use App\Support\MediaStorage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'name', 'slug', 'logo_path', 'show_name', 'website',
        'contact_name', 'email', 'phone', 'is_active', 'order',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'show_name' => 'boolean'];
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function logoUrl(): ?string
    {
        return $this->logo_path ? MediaStorage::url($this->logo_path) : null;
    }
}
