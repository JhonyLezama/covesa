import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';

interface ReferralRow {
  id: number;
  code: string;
  referrer: string;
  referred: string;
  commission: string | null;
  paid: boolean;
  status: { name: string; color: string } | null;
}

interface PaginatedReferrals {
  data: ReferralRow[];
  links: { url: string | null; label: string; active: boolean }[];
}

interface Option {
  id: number;
  name: string;
}

interface IndexProps {
  referrals: PaginatedReferrals;
  filters: { q: string; status_id: string };
  statuses: Option[];
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

export default function Index() {
  const { referrals, filters, statuses, flash } = usePage<IndexProps>().props;

  const applyFilters = (next: { q: string; status_id: string }) => {
    router.get(route('admin.referidos.index'), next, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <AdminLayout>
      <Head title="Referidos" />

      <h1 className="text-2xl font-medium text-gray-text mb-6">Refiere y Gana</h1>

      {flash?.success && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{flash.success}</p>
      )}

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          defaultValue={filters.q}
          placeholder="Buscar por nombre o código…"
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
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-muted">
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Refiere → Referido</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Comisión</th>
              <th className="px-4 py-3 font-medium text-right">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {referrals.data.map((r) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-gray-bg/50">
                <td className="px-4 py-3 font-mono text-gray-text">{r.code}</td>
                <td className="px-4 py-3 text-gray-muted">{r.referrer} → {r.referred}</td>
                <td className="px-4 py-3">
                  {r.status && (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs text-white"
                      style={{ backgroundColor: r.status.color }}
                    >
                      {r.status.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-muted">
                  {r.commission ?? '—'}
                  {r.paid && <span className="ml-1 text-xs text-green-700">(pagada)</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={route('admin.referidos.show', r.id)} className="text-navy hover:underline">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {referrals.data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-muted">
                  Sin referidos para estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {referrals.links.length > 3 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {referrals.links.map((l, i) => (
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
