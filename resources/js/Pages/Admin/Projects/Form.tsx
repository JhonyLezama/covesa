import type { FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';
import MediaManager from '../../../Components/MediaManager';
import type { MediaItem } from '../../../Components/MediaManager';

interface Option {
  id: number;
  name: string;
}

interface EditProject {
  id: number;
  name: string;
  slug: string;
  status_id: number;
  zone_id: number;
  client_id: number | null;
  client_name: string | null;
  service_type: string | null;
  video_url: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  order: number;
  is_published: boolean;
  title: string;
  subtitle: string | null;
  description: string | null;
  features_text: string | null;
}

interface FormProps {
  project: EditProject | null;
  media?: MediaItem[];
  zones: Option[];
  statuses: Option[];
  clients: Option[];
  errors?: Record<string, string>;
  [key: string]: unknown;
}

const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none';
const labelClass = 'block text-sm font-medium text-gray-text mb-1';
const errorClass = 'mt-1 text-sm text-red-600';

export default function Form() {
  const { project, media, zones, statuses, clients, errors } = usePage<FormProps>().props;
  const isEdit = project !== null;

  const { data, setData, post, put, processing } = useForm({
    name: project?.name ?? '',
    slug: project?.slug ?? '',
    status_id: project?.status_id.toString() ?? '',
    zone_id: project?.zone_id.toString() ?? '',
    client_id: project?.client_id?.toString() ?? '',
    client_name: project?.client_name ?? '',
    service_type: project?.service_type ?? '',
    video_url: project?.video_url ?? '',
    latitude: project?.latitude?.toString() ?? '',
    longitude: project?.longitude?.toString() ?? '',
    order: project?.order.toString() ?? '0',
    is_published: project?.is_published ?? false,
    title: project?.title ?? '',
    subtitle: project?.subtitle ?? '',
    description: project?.description ?? '',
    features_text: project?.features_text ?? '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isEdit) put(route('admin.proyectos.update', project!.id));
    else post(route('admin.proyectos.store'));
  };

  return (
    <AdminLayout>
      <Head title={isEdit ? 'Editar proyecto' : 'Nuevo proyecto'} />

      <div className="mb-6">
        <Link href={route('admin.proyectos.index')} className="text-sm text-navy hover:underline">
          ← Volver al listado
        </Link>
        <h1 className="mt-1 text-2xl font-medium text-gray-text">
          {isEdit ? `Editar: ${project!.name}` : 'Nuevo proyecto'}
        </h1>
      </div>

      <form onSubmit={submit} className="max-w-2xl space-y-6">
        <fieldset className="space-y-4 rounded-xl bg-white p-6 shadow">
          <legend className="px-1 text-sm font-medium text-gray-muted">Ficha del proyecto</legend>

          <div>
            <label htmlFor="name" className={labelClass}>Nombre *</label>
            <input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
            {errors?.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>Slug (vacío = automático desde el nombre)</label>
            <input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} className={inputClass} />
            {errors?.slug && <p className={errorClass}>{errors.slug}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status_id" className={labelClass}>Estado *</label>
              <select id="status_id" value={data.status_id} onChange={(e) => setData('status_id', e.target.value)} className={inputClass}>
                <option value="">Seleccionar…</option>
                {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {errors?.status_id && <p className={errorClass}>{errors.status_id}</p>}
            </div>
            <div>
              <label htmlFor="zone_id" className={labelClass}>Zona *</label>
              <select id="zone_id" value={data.zone_id} onChange={(e) => setData('zone_id', e.target.value)} className={inputClass}>
                <option value="">Seleccionar…</option>
                {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
              {errors?.zone_id && <p className={errorClass}>{errors.zone_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="client_id" className={labelClass}>Cliente (directorio)</label>
              <select id="client_id" value={data.client_id} onChange={(e) => setData('client_id', e.target.value)} className={inputClass}>
                <option value="">Sin cliente</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors?.client_id && <p className={errorClass}>{errors.client_id}</p>}
            </div>
            <div>
              <label htmlFor="client_name" className={labelClass}>Cliente (texto libre, legado)</label>
              <input id="client_name" value={data.client_name} onChange={(e) => setData('client_name', e.target.value)} className={inputClass} />
              {errors?.client_name && <p className={errorClass}>{errors.client_name}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="service_type" className={labelClass}>Tipo de servicio</label>
            <input id="service_type" placeholder="Project Management" value={data.service_type} onChange={(e) => setData('service_type', e.target.value)} className={inputClass} />
            {errors?.service_type && <p className={errorClass}>{errors.service_type}</p>}
          </div>

          <div>
            <label htmlFor="video_url" className={labelClass}>URL del video</label>
            <input id="video_url" type="url" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} className={inputClass} />
            {errors?.video_url && <p className={errorClass}>{errors.video_url}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="latitude" className={labelClass}>Latitud</label>
              <input id="latitude" type="number" step="any" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} className={inputClass} />
              {errors?.latitude && <p className={errorClass}>{errors.latitude}</p>}
            </div>
            <div>
              <label htmlFor="longitude" className={labelClass}>Longitud</label>
              <input id="longitude" type="number" step="any" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} className={inputClass} />
              {errors?.longitude && <p className={errorClass}>{errors.longitude}</p>}
            </div>
            <div>
              <label htmlFor="order" className={labelClass}>Orden</label>
              <input id="order" type="number" min="0" step="1" value={data.order} onChange={(e) => setData('order', e.target.value)} className={inputClass} />
              {errors?.order && <p className={errorClass}>{errors.order}</p>}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-text">
            <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
            Publicado
          </label>
        </fieldset>

        <fieldset className="space-y-4 rounded-xl bg-white p-6 shadow">
          <legend className="px-1 text-sm font-medium text-gray-muted">Contenido en español</legend>

          <div>
            <label htmlFor="title" className={labelClass}>Título *</label>
            <input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
            {errors?.title && <p className={errorClass}>{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="subtitle" className={labelClass}>Subtítulo</label>
            <input id="subtitle" value={data.subtitle} onChange={(e) => setData('subtitle', e.target.value)} className={inputClass} />
            {errors?.subtitle && <p className={errorClass}>{errors.subtitle}</p>}
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Descripción *</label>
            <textarea id="description" rows={5} value={data.description} onChange={(e) => setData('description', e.target.value)} className={inputClass} />
            <p className="mt-1 text-xs text-gray-muted">Usa **palabra** para resaltar en mayúsculas y negrita en las cards.</p>
            {errors?.description && <p className={errorClass}>{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="features_text" className={labelClass}>Características (una por línea)</label>
            <textarea id="features_text" rows={4} value={data.features_text} onChange={(e) => setData('features_text', e.target.value)} className={inputClass} />
            {errors?.features_text && <p className={errorClass}>{errors.features_text}</p>}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={processing}
          className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
        >
          {processing ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear proyecto'}
        </button>
      </form>

      {isEdit && (
        <div className="max-w-2xl">
          <MediaManager
            parentId={project!.id}
            parentLabel={project!.name}
            initialMedia={media ?? []}
            routes={{
              store: 'admin.proyectos.media.store',
              reorder: 'admin.proyectos.media.reorder',
              featured: 'admin.proyectos.media.featured',
              destroy: 'admin.proyectos.media.destroy',
            }}
          />
        </div>
      )}
    </AdminLayout>
  );
}
