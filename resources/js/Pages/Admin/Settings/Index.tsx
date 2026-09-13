import { Head, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

interface SettingRow {
  key: string;
  value: string | null;
  type: string;
  group: string;
}

interface SettingsProps {
  settings: SettingRow[];
  flash?: { success?: string };
  errors?: Record<string, string>;
  [key: string]: unknown;
}

const toneOptions = [
  { value: 'black', label: 'Negro neutro (las fotos conservan sus colores)' },
  { value: 'navy', label: 'Azul COVESA (tiñe la foto de azul corporativo)' },
];

const intensityOptions = [
  { value: 'suave', label: 'Suave (40%)' },
  { value: 'medio', label: 'Medio (55%)' },
  { value: 'fuerte', label: 'Fuerte (70%)' },
];

const selectClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none bg-white';

export default function Index() {
  const { settings, flash, errors } = usePage<SettingsProps>().props;
  const byKey = Object.fromEntries(settings.map((s) => [s.key, s.value ?? '']));

  const { data, setData, patch, processing } = useForm({
    hero_overlay: byKey.hero_overlay || 'black',
    hero_overlay_intensity: byKey.hero_overlay_intensity || 'medio',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    patch(route('admin.ajustes.update'));
  };

  return (
    <AdminLayout>
      <Head title="Ajustes de apariencia" />

      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-text">Ajustes de apariencia</h1>
        <p className="mt-1 text-sm text-gray-muted">
          Overlay del carrusel principal (hero). Se aplica al instante en la página pública.
        </p>
      </div>

      {flash?.success && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{flash.success}</p>
      )}

      <form onSubmit={submit} className="max-w-xl space-y-4 rounded-xl bg-white p-6 shadow">
        <div>
          <label htmlFor="hero_overlay" className="block text-sm font-medium text-gray-text mb-1">
            Tono del overlay
          </label>
          <select
            id="hero_overlay"
            value={data.hero_overlay}
            onChange={(e) => setData('hero_overlay', e.target.value)}
            className={selectClass}
          >
            {toneOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors?.hero_overlay && <p className="mt-1 text-sm text-red-600">{errors.hero_overlay}</p>}
        </div>

        <div>
          <label htmlFor="hero_overlay_intensity" className="block text-sm font-medium text-gray-text mb-1">
            Intensidad
          </label>
          <select
            id="hero_overlay_intensity"
            value={data.hero_overlay_intensity}
            onChange={(e) => setData('hero_overlay_intensity', e.target.value)}
            className={selectClass}
          >
            {intensityOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors?.hero_overlay_intensity && <p className="mt-1 text-sm text-red-600">{errors.hero_overlay_intensity}</p>}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={processing}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
          >
            Guardar ajustes
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
