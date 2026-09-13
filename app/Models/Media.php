<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Media extends Model
{
    /**
     * Decisión explícita (Día 4, confirmada por el cliente): SIN SoftDeletes.
     * properties/projects/blog_posts/leads sí lo usan porque un registro de
     * negocio debe poder recuperarse; una foto de galería es reemplazable y
     * el borrado suave solo dejaría archivos huérfanos en disco. Por eso el
     * PropertyMediaController elimina en duro (registro + archivo).
     */    protected $fillable = [
        'mediable_id', 'mediable_type', 'type', 'path',
        'original_name', 'mime_type', 'size', 'order', 'alt_text',
    ];

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }
}
