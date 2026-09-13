import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

interface EditUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  position: string | null;
  is_active: boolean;
  role?: string;
}

interface FormProps {
  user: EditUser | null;
  roles: string[];
  errors?: Record<string, string>;
  [key: string]: unknown;
}

const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none';

export default function Form() {
  const { user, roles, errors } = usePage<FormProps>().props;
  const isEdit = user !== null;

  const { data, setData, post, processing } = useForm({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    position: user?.position ?? '',
    role: user?.role ?? 'comercial',
    is_active: user?.is_active ?? true,
    password: '',
    password_confirmation: '',
    photo: null as File | null,
    _method: isEdit ? 'PUT' : 'POST',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(isEdit ? route('admin.usuarios.update', user!.id) : route('admin.usuarios.store'));
  };

  return (
    <AdminLayout>
      <Head title={isEdit ? 'Editar usuario' : 'Nuevo usuario'} />

      <div className="mb-6">
        <Link href={route('admin.usuarios.index')} className="text-sm text-navy hover:underline">
          ← Volver al listado
        </Link>
        <h1 className="mt-1 text-2xl font-medium text-gray-text">
          {isEdit ? `Editar: ${user!.name}` : 'Nuevo usuario'}
        </h1>
      </div>

      <form onSubmit={submit} className="max-w-xl space-y-4 rounded-xl bg-white p-6 shadow">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-text mb-1">Nombre *</label>
          <input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
          {errors?.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-text mb-1">Email *</label>
          <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} />
          {errors?.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-text mb-1">
              Contraseña {isEdit ? '(vacía = no cambiar)' : '*'}
            </label>
            <input id="password" type="password" autoComplete="new-password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass} />
            {errors?.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-text mb-1">Confirmar contraseña</label>
            <input id="password_confirmation" type="password" autoComplete="new-password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-text mb-1">Teléfono</label>
            <input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} />
            {errors?.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-text mb-1">Cargo</label>
            <input id="position" placeholder="Broker corporativo" value={data.position} onChange={(e) => setData('position', e.target.value)} className={inputClass} />
            {errors?.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-text mb-1">Rol *</label>
            <select id="role" value={data.role} onChange={(e) => setData('role', e.target.value)} className={inputClass}>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors?.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-text mb-1">Foto</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setData('photo', e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
            {isEdit && user!.photo && (
              <p className="mt-1 text-xs text-gray-muted">Actual: /storage/{user!.photo}</p>
            )}
            {errors?.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-text">
          <input
            type="checkbox"
            checked={data.is_active}
            onChange={(e) => setData('is_active', e.target.checked)}
          />
          Usuario activo
        </label>

        <button
          type="submit"
          disabled={processing}
          className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
        >
          {processing ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear usuario'}
        </button>
      </form>
    </AdminLayout>
  );
}
