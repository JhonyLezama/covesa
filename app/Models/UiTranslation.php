<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UiTranslation extends Model
{
    protected $fillable = ['group', 'key', 'locale', 'value'];
}
