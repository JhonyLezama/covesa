<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'message' => ['nullable', 'string', 'max:2000'],
        ], [], [
            'name' => 'nombre',
            'email' => 'email',
            'phone' => 'teléfono',
            'message' => 'mensaje',
        ]);

        // TODO: persistir en BD / enviar mail (Mail::to(...)->send(new ContactMessage($data))).
        Log::info('Nuevo contacto COVESA', $data);

        return back()->with(
            'success',
            '¡Mensaje enviado correctamente! Nos comunicaremos contigo a la brevedad.'
        );
    }
}
