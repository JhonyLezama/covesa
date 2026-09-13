import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';

interface PropertyRow {
  id: number;
  title: string;
  slug: string;
  operation: string;
  area_total: string;
  price: string | null;
  currency: string;
  is_published: boolean;
  is_featured: boolean;
  type?: string;
  zone?: string;
  status: { name: string; color: string } | null;
  advisor?: string;
}

interface PaginatedProperties {
  data: PropertyRow[];
  links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps {
  properties: PaginatedProperties;
  filters: { q: string; operation: string; published: string };
  canEdit: boolean;
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

export default function Index() {
  const { properties, filters, canEdit, flash } = usePage<IndexProps>().props;

  const applyFilters = (next: { q: string; operation: string; published: string }) => {
    router.get(route('admin.propiedades.index'), next, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const destroy = (title: string, id: number) => {
    if (window.confirm(`¿Eliminar "${title}"? Se conserva su historial (eliminación lógica).`)) {
      router.delete(route('admin.propiedades.destroy', id), { preserveScroll: true });
    }
  };

  return (
    <AdminLayout>
      <Head title="Propiedades" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-text">Propiedades</h1>
        {canEdit && (
          <Link
            href={route('admin.propiedades.create')}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
          >
            Nueva propiedad
          </Link>
        )}
      </div>

      {flash?.success && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{flash.success}</p>
      )}
      {flash?.error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{flash.error}</p>
      )}

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          defaultValue={filters.q}
          placeholder="Buscar por título…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyFilters({ ...filters, q: (e.target as HTMLInputElement).value });
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.operation}
          onChange={(e) => applyFilters({ ...filters, operation: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Venta + alquiler</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
        <select
          value={filters.published}
          onChange={(e) => applyFilters({ ...filters, published: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todas</option>
          <option value="publicadas">Publicadas</option>
          <option value="borrador">Borrador</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-muted">
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Tipo / Zona</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Asesor</th>
              {canEdit && <th className="px-4 py-3 font-medium text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {properties.data.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-bg/50">
                <td className="px-4 py-3 font-medium text-gray-text">
                  {p.title}
                  <span className="ml-2 text-xs font-normal text-gray-muted">
                    {p.operation} · {p.is_published ? 'publicada' : 'borrador'}
                    {p.is_featured ? ' · destacada' : ''}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-muted">{p.type} / {p.zone}</td>
                <td className="px-4 py-3">
                  {p.status && (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs text-white"
                      style={{ backgroundColor: p.status.color }}
                    >
                      {p.status.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-muted">
                  {p.price ? `${p.currency} ${p.price}` : 'Consultar'}
                </td>
                <td className="px-4 py-3 text-gray-muted">{p.advisor ?? '—'}</td>
                {canEdit && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={route('admin.propiedades.edit', p.id)} className="mr-3 text-navy hover:underline">
                      Editar
                    </Link>
                    <button type="button" onClick={() => destroy(p.title, p.id)} className="text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {properties.data.length === 0 && (
              <tr>
                <td colSpan={canEdit ? 6 : 5} className="px-4 py-6 text-center text-gray-muted">
                  Sin propiedades para estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {properties.links.length > 3 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {properties.links.map((l, i) => (
            <button
              key={i}
              type="button"
              disabled={!l.url}
              onClick={() => l.url && router.visit(l.url, { preserveScroll: true })}
              className={`rounded-lg px-3 py-1.5 text-sm ${l.active ? 'bg-navy text-white' : 'bg-white text-gray-text hover:bg-gray-100'} disabled:opacity-40`}
              dangerouslySetInnerHTML={{ __html: l.label }}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
