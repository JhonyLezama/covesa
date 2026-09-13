<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Página institucional "Nosotros" (Semana 5 Día 1): contenido
     * hardcodeado en el componente React, sin tabla propia por ahora.
     */
    public function index(): Response
    {
        return Inertia::render('Nosotros', [
            'settings' => Setting::pluck('value', 'key')->all(),
        ]);
    }
}
