import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

interface EditClient {
  id: number;
  name: string;
  slug: string;
  website: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  order: number | null;
  is_active: boolean;
  show_name: boolean;
  logo_url: string | null;
}

interface FormProps {
  client: EditClient | null;
  errors?: Record<string, string>;
  flash?: { success?: string };
  [key: string]: unknown;
}

const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none';
const labelClass = 'block text-sm font-medium text-gray-text mb-1';

export default function Form() {
  const { client, errors } = usePage<FormProps>().props;
  const isEdit = client !== null;

  const { data, setData, post, processing } = useForm({
    name: client?.name ?? '',
    slug: client?.slug ?? '',
    website: client?.website ?? '',
    contact_name: client?.contact_name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    order: client?.order ?? 0,
    is_active: client?.is_active ?? true,
    show_name: client?.show_name ?? true,
    logo: null as File | null,
    _method: isEdit ? 'PUT' : 'POST',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(isEdit ? route('admin.clientes.update', client!.id) : route('admin.clientes.store'));
  };

  return (
    <AdminLayout>
      <Head title={isEdit ? 'Editar cliente' : 'Nuevo cliente'} />

      <div className="mb-6">
        <Link href={route('admin.clientes.index')} className="text-sm text-navy hover:underline">
          ← Volver al listado
        </Link>
        <h1 className="mt-1 text-2xl font-medium text-gray-text">
          {isEdit ? `Editar: ${client!.name}` : 'Nuevo cliente'}
        </h1>
      </div>

      <form onSubmit={submit} className="max-w-xl space-y-4 rounded-xl bg-white p-6 shadow">
        <div>
          <label htmlFor="name" className={labelClass}>Nombre *</label>
          <input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
          {errors?.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>Slug (vacío = automático)</label>
          <input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} className={inputClass} />
          {errors?.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="website" className={labelClass}>Sitio web</label>
            <input id="website" value={data.website} onChange={(e) => setData('website', e.target.value)} className={inputClass} placeholder="https://" />
            {errors?.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
          </div>
          <div>
            <label htmlFor="contact_name" className={labelClass}>Contacto</label>
            <input id="contact_name" value={data.contact_name} onChange={(e) => setData('contact_name', e.target.value)} className={inputClass} />
            {errors?.contact_name && <p className="mt-1 text-sm text-red-600">{errors.contact_name}</p>}
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} />
            {errors?.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Teléfono</label>
            <input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} />
            {errors?.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="logo" className={labelClass}>Logo (imagen, máx 2MB)</label>
          {client?.logo_url && (
            <img src={client.logo_url} alt={client.name} className="mb-2 h-12 w-auto rounded border border-gray-200 bg-gray-bg object-contain" />
          )}
          <input
            id="logo"
            type="file"
            accept="image/*"
            onChange={(e) => setData('logo', e.target.files?.[0] ?? null)}
            className="text-sm text-gray-muted"
          />
          {errors?.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="order" className={labelClass}>Orden</label>
            <input id="order" type="number" min={0} value={data.order} onChange={(e) => setData('order', Number(e.target.value))} className={inputClass} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-text pt-6">
            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
            Activo
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-text pt-6" title="Mostrar el nombre junto al logo en las cards">
            <input type="checkbox" checked={data.show_name} onChange={(e) => setData('show_name', e.target.checked)} />
            Mostrar nombre
          </label>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
        >
          {isEdit ? 'Guardar cambios' : 'Crear cliente'}
        </button>
      </form>
    </AdminLayout>
  );
}
