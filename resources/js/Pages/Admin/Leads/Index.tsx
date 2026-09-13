import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';

interface LeadRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  created: string;
  status: { name: string; color: string } | null;
  advisor?: string;
}

interface PaginatedLeads {
  data: LeadRow[];
  links: { url: string | null; label: string; active: boolean }[];
}

interface Option {
  id: number;
  name: string;
}

interface IndexProps {
  leads: PaginatedLeads;
  filters: { q: string; status_id: string; source: string; assigned: string };
  statuses: Option[];
  sources: string[];
  advisors: Option[];
  isManager: boolean;
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

const sourceLabels: Record<string, string> = {
  contacto: 'Contacto',
  vende_tu_propiedad: 'Vende tu propiedad',
  landing_proyecto: 'Landing proyecto',
  busca_propiedad: 'Busca propiedad',
  refiere_y_gana: 'Refiere y gana',
};

export default function Index() {
  const { leads, filters, statuses, sources, advisors, isManager, flash } = usePage<IndexProps>().props;

  const applyFilters = (next: { q: string; status_id: string; source: string; assigned: string }) => {
    router.get(route('admin.leads.index'), next, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <AdminLayout>
      <Head title="Leads" />

      <h1 className="text-2xl font-medium text-gray-text mb-6">Leads</h1>

      {flash?.success && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{flash.success}</p>
      )}

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          defaultValue={filters.q}
          placeholder="Buscar nombre, email o teléfono…"
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
          value={filters.source}
          onChange={(e) => applyFilters({ ...filters, source: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todas las fuentes</option>
          {sources.map((s) => (
            <option key={s} value={s}>{sourceLabels[s] ?? s}</option>
          ))}
        </select>
        {isManager && (
          <select
            value={filters.assigned}
            onChange={(e) => applyFilters({ ...filters, assigned: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Todos los asesores</option>
            {advisors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-muted">
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Fuente</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Asesor</th>
              <th className="px-4 py-3 font-medium text-right">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {leads.data.map((l) => (
              <tr key={l.id} className="border-b last:border-0 hover:bg-gray-bg/50">
                <td className="px-4 py-3 font-medium text-gray-text">
                  {l.name}
                  <span className="block text-xs font-normal text-gray-muted">{l.email} · {l.phone}</span>
                </td>
                <td className="px-4 py-3 text-gray-muted">{sourceLabels[l.source] ?? l.source}</td>
                <td className="px-4 py-3">
                  {l.status && (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs text-white"
                      style={{ backgroundColor: l.status.color }}
                    >
                      {l.status.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-muted">{l.advisor ?? 'Sin asignar'}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={route('admin.leads.show', l.id)} className="text-navy hover:underline">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {leads.data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-muted">
                  Sin leads para estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {leads.links.length > 3 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {leads.links.map((l, i) => (
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
