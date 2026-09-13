import type { FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';

interface Option {
  id: number;
  name: string;
}

interface ShowProps {
  lead: {
    id: number;
    name: string;
    document: string | null;
    email: string;
    phone: string;
    location: string | null;
    source: string;
    message: string | null;
    extra_data: Record<string, string | number | boolean | null>;
    notes: string | null;
    created: string;
    data_policy: boolean;
    marketing_policy: boolean;
    status: { id: number; name: string; color: string } | null;
    advisor: { id: number; name: string } | null;
    property?: string;
    project?: string;
  };
  statuses: Option[];
  advisors: Option[];
  canReassign: boolean;
  canChangeStatus: boolean;
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

const humanize = (key: string) =>
  key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const labelClass = 'block text-xs text-gray-muted mb-1';
const valueClass = 'text-sm text-gray-text';

export default function Show() {
  const { lead, statuses, advisors, canReassign, canChangeStatus, flash } = usePage<ShowProps>().props;

  const statusForm = useForm({ status_id: lead.status?.id.toString() ?? '' });
  const reassignForm = useForm({ assigned_user_id: lead.advisor?.id.toString() ?? '' });

  const changeStatus = (e: FormEvent) => {
    e.preventDefault();
    statusForm.patch(route('admin.leads.status', lead.id), { preserveScroll: true });
  };

  const reassign = (e: FormEvent) => {
    e.preventDefault();
    reassignForm.patch(route('admin.leads.reassign', lead.id), { preserveScroll: true });
  };

  const extraEntries = Object.entries(lead.extra_data ?? {});

  return (
    <AdminLayout>
      <Head title={lead.name} />

      <div className="mb-6">
        <Link href={route('admin.leads.index')} className="text-sm text-navy hover:underline">
          ← Volver a leads
        </Link>
        <div className="mt-1 flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-medium text-gray-text">{lead.name}</h1>
          {lead.status && (
            <span
              className="rounded-full px-2 py-0.5 text-xs text-white"
              style={{ backgroundColor: lead.status.color }}
            >
              {lead.status.name}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-muted">
          {lead.source} · {lead.created} · Asesor: {lead.advisor?.name ?? 'Sin asignar'}
        </p>
      </div>

      {flash?.success && (
        <p className="mb-4 max-w-2xl rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{flash.success}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
        <section className="lg:col-span-2 space-y-4 rounded-xl bg-white p-6 shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className={labelClass}>Email</span>
              <p className={valueClass}>{lead.email}</p>
            </div>
            <div>
              <span className={labelClass}>Teléfono</span>
              <p className={valueClass}>{lead.phone}</p>
            </div>
            {lead.document && (
              <div>
                <span className={labelClass}>Documento</span>
                <p className={valueClass}>{lead.document}</p>
              </div>
            )}
            {lead.location && (
              <div>
                <span className={labelClass}>Ubicación</span>
                <p className={valueClass}>{lead.location}</p>
              </div>
            )}
            {lead.property && (
              <div>
                <span className={labelClass}>Propiedad de interés</span>
                <p className={valueClass}>{lead.property}</p>
              </div>
            )}
            {lead.project && (
              <div>
                <span className={labelClass}>Proyecto de interés</span>
                <p className={valueClass}>{lead.project}</p>
              </div>
            )}
          </div>

          {lead.message && (
            <div>
              <span className={labelClass}>Mensaje</span>
              <p className={`${valueClass} whitespace-pre-line`}>{lead.message}</p>
            </div>
          )}

          {extraEntries.length > 0 && (
            <div>
              <span className={labelClass}>Datos del formulario</span>
              <dl className="rounded-lg bg-gray-bg p-3 text-sm">
                {extraEntries.map(([k, v]) => (
                  <div key={k} className="flex gap-2 py-0.5">
                    <dt className="text-gray-muted">{humanize(k)}:</dt>
                    <dd className="text-gray-text">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {lead.notes && (
            <div>
              <span className={labelClass}>Notas internas</span>
              <p className={`${valueClass} whitespace-pre-line`}>{lead.notes}</p>
            </div>
          )}

          <p className="text-xs text-gray-muted">
            Aceptó datos: {lead.data_policy ? 'Sí' : 'No'} · Marketing: {lead.marketing_policy ? 'Sí' : 'No'}
          </p>
        </section>

        <aside className="space-y-4">
          {canChangeStatus && (
            <form onSubmit={changeStatus} className="rounded-xl bg-white p-4 shadow">
              <label htmlFor="status_id" className={labelClass}>Cambiar estado</label>
              <select
                id="status_id"
                value={statusForm.data.status_id}
                onChange={(e) => statusForm.setData('status_id', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {statusForm.errors.status_id && (
                <p className="mt-1 text-sm text-red-600">{statusForm.errors.status_id}</p>
              )}
              <button
                type="submit"
                disabled={statusForm.processing}
                className="mt-2 w-full rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
              >
                Actualizar estado
              </button>
            </form>
          )}

          {canReassign && (
            <form onSubmit={reassign} className="rounded-xl bg-white p-4 shadow">
              <label htmlFor="assigned_user_id" className={labelClass}>Reasignar asesor</label>
              <select
                id="assigned_user_id"
                value={reassignForm.data.assigned_user_id}
                onChange={(e) => reassignForm.setData('assigned_user_id', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Sin asignar</option>
                {advisors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              {reassignForm.errors.assigned_user_id && (
                <p className="mt-1 text-sm text-red-600">{reassignForm.errors.assigned_user_id}</p>
              )}
              <button
                type="submit"
                disabled={reassignForm.processing}
                className="mt-2 w-full rounded-lg border border-navy px-4 py-2 text-sm font-medium text-navy hover:bg-navy hover:text-white disabled:opacity-60"
              >
                Reasignar
              </button>
            </form>
          )}
        </aside>
      </div>
    </AdminLayout>
  );
}
