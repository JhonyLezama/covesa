import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

interface ClientRow {
  id: number;
  name: string;
  logo_url: string | null;
  is_active: boolean;
  projects_count: number;
}

interface Paginated {
  data: ClientRow[];
  prev_page_url: string | null;
  next_page_url: string | null;
}

interface IndexProps {
  clients: Paginated;
  filters: { q: string };
  [key: string]: unknown;
}

export default function Index() {
  const { clients, filters } = usePage<IndexProps>().props;
  const [q, setQ] = useState(filters.q);

  const search = () => router.get(route('admin.clientes.index'), { q }, { preserveState: true, replace: true });

  return (
    <AdminLayout>
      <Head title="Clientes" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <h1 className="text-2xl font-medium text-gray-text">Clientes</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Buscar por nombre…"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
          />
          <Link
            href={route('admin.clientes.create')}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
          >
            Nuevo
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-muted">
              <th className="px-4 py-3 font-medium">Logo</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Proyectos</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.data.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-gray-bg/50">
                <td className="px-4 py-3">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="h-8 w-16 rounded object-contain bg-gray-bg" />
                  ) : (
                    <span className="text-gray-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-text">{c.name}</td>
                <td className="px-4 py-3 text-gray-muted">{c.projects_count}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {c.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={route('admin.clientes.edit', c.id)} className="text-navy hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {clients.data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-muted">
                  Sin clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={!clients.prev_page_url}
          onClick={() => clients.prev_page_url && router.get(clients.prev_page_url)}
          className="rounded-lg bg-white px-3 py-1.5 text-sm text-gray-text hover:bg-gray-100 disabled:opacity-40"
        >
          ← Anterior
        </button>
        <button
          type="button"
          disabled={!clients.next_page_url}
          onClick={() => clients.next_page_url && router.get(clients.next_page_url)}
          className="rounded-lg bg-white px-3 py-1.5 text-sm text-gray-text hover:bg-gray-100 disabled:opacity-40"
        >
          Siguiente →
        </button>
      </div>
    </AdminLayout>
  );
}
