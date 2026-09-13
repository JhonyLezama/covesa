<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Ajustes agrupados. Solo admin (permiso manage-settings):
     * aquí vive el switch del overlay del hero (tono + intensidad).
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('manage-settings'), 403);

        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::orderBy('group')->orderBy('key')->get(['key', 'value', 'type', 'group']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        abort_unless($request->user()->can('manage-settings'), 403);

        $data = $request->validate([
            'hero_overlay' => ['required', Rule::in(['black', 'navy'])],
            'hero_overlay_intensity' => ['required', Rule::in(['suave', 'medio', 'fuerte'])],
        ]);

        foreach ($data as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }

        return back()->with('success', 'Ajustes de apariencia actualizados.');
    }
}
