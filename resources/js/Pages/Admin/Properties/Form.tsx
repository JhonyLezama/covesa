import { useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';
import MediaManager from '../../../Components/MediaManager';
import type { MediaItem } from '../../../Components/MediaManager';

interface Option {
  id: number;
  name: string;
}

interface EditProperty {
  id: number;
  project_id: number | null;
  property_type_id: number;
  zone_id: number;
  status_id: number;
  assigned_user_id: number | null;
  title: string;
  slug: string;
  operation: string;
  area_total: string | number;
  area_unit: string;
  price: string | number | null;
  currency: string;
  price_type: string;
  lots_available: number | null;
  ideal_for: string[];
  latitude: string | number | null;
  longitude: string | number | null;
  address: string | null;
  is_published: boolean;
  is_featured: boolean;
}

interface FormProps {
  property: EditProperty | null;
  media?: MediaItem[];
  types: Option[];
  zones: Option[];
  statuses: Option[];
  projects: Option[];
  advisors: Option[];
  errors?: Record<string, string>;
  [key: string]: unknown;
}

const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none';
const labelClass = 'block text-sm font-medium text-gray-text mb-1';
const errorClass = 'mt-1 text-sm text-red-600';

export default function Form() {
  const { property, media, types, zones, statuses, projects, advisors, errors } = usePage<FormProps>().props;
  const isEdit = property !== null;
  const [tagInput, setTagInput] = useState('');

  const { data, setData, post, put, processing } = useForm({
    project_id: property?.project_id?.toString() ?? '',
    property_type_id: property?.property_type_id.toString() ?? '',
    zone_id: property?.zone_id.toString() ?? '',
    status_id: property?.status_id.toString() ?? '',
    assigned_user_id: property?.assigned_user_id?.toString() ?? '',
    title: property?.title ?? '',
    slug: property?.slug ?? '',
    operation: property?.operation ?? 'venta',
    area_total: property?.area_total?.toString() ?? '',
    area_unit: property?.area_unit ?? 'm2',
    price: property?.price?.toString() ?? '',
    currency: property?.currency ?? 'USD',
    price_type: property?.price_type ?? 'total',
    lots_available: property?.lots_available?.toString() ?? '',
    ideal_for: property?.ideal_for ?? ([] as string[]),
    latitude: property?.latitude?.toString() ?? '',
    longitude: property?.longitude?.toString() ?? '',
    address: property?.address ?? '',
    is_published: property?.is_published ?? false,
    is_featured: property?.is_featured ?? false,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isEdit) put(route('admin.propiedades.update', property!.id));
    else post(route('admin.propiedades.store'));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !data.ideal_for.includes(tag)) {
      setData('ideal_for', [...data.ideal_for, tag]);
    }
    setTagInput('');
  };

  const tagKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <AdminLayout>
      <Head title={isEdit ? 'Editar propiedad' : 'Nueva propiedad'} />

      <div className="mb-6">
        <Link href={route('admin.propiedades.index')} className="text-sm text-navy hover:underline">
          ← Volver al listado
        </Link>
        <h1 className="mt-1 text-2xl font-medium text-gray-text">
          {isEdit ? `Editar: ${property!.title}` : 'Nueva propiedad'}
        </h1>
      </div>

      <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow">
        <div>
          <label htmlFor="title" className={labelClass}>Título *</label>
          <input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
          {errors?.title && <p className={errorClass}>{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>Slug (vacío = automático desde el título)</label>
          <input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} className={inputClass} />
          {errors?.slug && <p className={errorClass}>{errors.slug}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="property_type_id" className={labelClass}>Tipo *</label>
            <select id="property_type_id" value={data.property_type_id} onChange={(e) => setData('property_type_id', e.target.value)} className={inputClass}>
              <option value="">Seleccionar…</option>
              {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {errors?.property_type_id && <p className={errorClass}>{errors.property_type_id}</p>}
          </div>
          <div>
            <label htmlFor="zone_id" className={labelClass}>Zona *</label>
            <select id="zone_id" value={data.zone_id} onChange={(e) => setData('zone_id', e.target.value)} className={inputClass}>
              <option value="">Seleccionar…</option>
              {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
            {errors?.zone_id && <p className={errorClass}>{errors.zone_id}</p>}
          </div>
          <div>
            <label htmlFor="status_id" className={labelClass}>Estado *</label>
            <select id="status_id" value={data.status_id} onChange={(e) => setData('status_id', e.target.value)} className={inputClass}>
              <option value="">Seleccionar…</option>
              {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors?.status_id && <p className={errorClass}>{errors.status_id}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="operation" className={labelClass}>Operación *</label>
            <select id="operation" value={data.operation} onChange={(e) => setData('operation', e.target.value)} className={inputClass}>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
            {errors?.operation && <p className={errorClass}>{errors.operation}</p>}
          </div>
          <div>
            <label htmlFor="project_id" className={labelClass}>Proyecto (opcional)</label>
            <select id="project_id" value={data.project_id} onChange={(e) => setData('project_id', e.target.value)} className={inputClass}>
              <option value="">Independiente</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors?.project_id && <p className={errorClass}>{errors.project_id}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="area_total" className={labelClass}>Área total *</label>
            <input id="area_total" type="number" min="0" step="0.01" value={data.area_total} onChange={(e) => setData('area_total', e.target.value)} className={inputClass} />
            {errors?.area_total && <p className={errorClass}>{errors.area_total}</p>}
          </div>
          <div>
            <label htmlFor="area_unit" className={labelClass}>Unidad</label>
            <select id="area_unit" value={data.area_unit} onChange={(e) => setData('area_unit', e.target.value)} className={inputClass}>
              <option value="m2">m²</option>
              <option value="ha">ha</option>
            </select>
          </div>
          <div>
            <label htmlFor="lots_available" className={labelClass}>Lotes disp.</label>
            <input id="lots_available" type="number" min="1" step="1" value={data.lots_available} onChange={(e) => setData('lots_available', e.target.value)} className={inputClass} />
            {errors?.lots_available && <p className={errorClass}>{errors.lots_available}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className={labelClass}>Precio (vacío = Consultar)</label>
            <input id="price" type="number" min="0" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className={inputClass} />
            {errors?.price && <p className={errorClass}>{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="currency" className={labelClass}>Moneda</label>
            <select id="currency" value={data.currency} onChange={(e) => setData('currency', e.target.value)} className={inputClass}>
              <option value="USD">USD</option>
              <option value="PEN">PEN</option>
            </select>
          </div>
          <div>
            <label htmlFor="price_type" className={labelClass}>Tipo de precio</label>
            <select id="price_type" value={data.price_type} onChange={(e) => setData('price_type', e.target.value)} className={inputClass}>
              <option value="total">Total</option>
              <option value="por_m2">Por m²</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="ideal_for" className={labelClass}>Ideal para (tags, Enter para agregar)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.ideal_for.map((tag) => (
              <span key={tag} className="rounded-full bg-navy/10 px-3 py-1 text-xs text-navy">
                {tag}
                <button
                  type="button"
                  onClick={() => setData('ideal_for', data.ideal_for.filter((t) => t !== tag))}
                  className="ml-2 font-bold hover:text-red-600"
                  aria-label={`Quitar ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            id="ideal_for"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={tagKey}
            placeholder="Almacenes"
            className={inputClass}
          />
          {errors?.ideal_for && <p className={errorClass}>{errors.ideal_for}</p>}
        </div>

        <div>
          <label htmlFor="assigned_user_id" className={labelClass}>Asesor asignado</label>
          <select id="assigned_user_id" value={data.assigned_user_id} onChange={(e) => setData('assigned_user_id', e.target.value)} className={inputClass}>
            <option value="">Sin asignar</option>
            {advisors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          {errors?.assigned_user_id && <p className={errorClass}>{errors.assigned_user_id}</p>}
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>Dirección</label>
          <input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} className={inputClass} />
          {errors?.address && <p className={errorClass}>{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-text">
            <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
            Publicada
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-text">
            <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} />
            Destacada en home
          </label>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
        >
          {processing ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear propiedad'}
        </button>
      </form>

      {isEdit && (
        <MediaManager
          parentId={property!.id}
          parentLabel={property!.title}
          initialMedia={media ?? []}
          routes={{
            store: 'admin.propiedades.media.store',
            reorder: 'admin.propiedades.media.reorder',
            featured: 'admin.propiedades.media.featured',
            destroy: 'admin.propiedades.media.destroy',
          }}
        />
      )}
    </AdminLayout>
  );
}
