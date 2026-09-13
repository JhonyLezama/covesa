import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';

interface ProjectRow {
  id: number;
  name: string;
  slug: string;
  client_name: string | null;
  is_published: boolean;
  order: number;
  zone?: string;
  status: { name: string; color: string } | null;
}

interface PaginatedProjects {
  data: ProjectRow[];
  links: { url: string | null; label: string; active: boolean }[];
}

interface StatusOption {
  id: number;
  name: string;
}

interface IndexProps {
  projects: PaginatedProjects;
  filters: { q: string; status_id: string; published: string };
  statuses: StatusOption[];
  canEdit: boolean;
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

export default function Index() {
  const { projects, filters, statuses, canEdit, flash } = usePage<IndexProps>().props;

  const applyFilters = (next: { q: string; status_id: string; published: string }) => {
    router.get(route('admin.proyectos.index'), next, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const destroy = (name: string, id: number) => {
    if (window.confirm(`¿Eliminar "${name}"? Se conserva su historial (eliminación lógica).`)) {
      router.delete(route('admin.proyectos.destroy', id), { preserveScroll: true });
    }
  };

  return (
    <AdminLayout>
      <Head title="Proyectos" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-text">Proyectos</h1>
        {canEdit && (
          <Link
            href={route('admin.proyectos.create')}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
          >
            Nuevo proyecto
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
          placeholder="Buscar por nombre…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyFilters({ ...filters, q: (e.target as HTMLInputElement).value });
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.status_id}
          onChange={(e) => applyFilters({ ...filters, status_id: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={filters.published}
          onChange={(e) => applyFilters({ ...filters, published: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="publicadas">Publicados</option>
          <option value="borrador">Borrador</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-muted">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Zona / Cliente</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Orden</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.data.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-bg/50">
                <td className="px-4 py-3 font-medium text-gray-text">
                  <Link href={route('admin.proyectos.show', p.id)} className="hover:text-navy hover:underline">
                    {p.name}
                  </Link>
                  <span className="ml-2 text-xs font-normal text-gray-muted">
                    {p.is_published ? 'publicado' : 'borrador'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-muted">{p.zone} / {p.client_name ?? '—'}</td>
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
                <td className="px-4 py-3 text-gray-muted">{p.order}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={route('admin.proyectos.show', p.id)} className="mr-3 text-navy hover:underline">
                    Ver
                  </Link>
                  {canEdit && (
                    <>
                      <Link href={route('admin.proyectos.edit', p.id)} className="mr-3 text-navy hover:underline">
                        Editar
                      </Link>
                      <button type="button" onClick={() => destroy(p.name, p.id)} className="text-red-600 hover:underline">
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {projects.data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-muted">
                  Sin proyectos para estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {projects.links.length > 3 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {projects.links.map((l, i) => (
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
