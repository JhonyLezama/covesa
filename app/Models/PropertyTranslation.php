<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// TODO: confirmar con cliente si TODAS las propiedades requieren traducción
// o solo proyectos grandes (ver base-data.txt §7). Mientras tanto
// esta tabla existe pero su uso es opcional en el CMS.
class PropertyTranslation extends Model
{
    protected $fillable = ['property_id', 'locale', 'description', 'ideal_for_text'];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
