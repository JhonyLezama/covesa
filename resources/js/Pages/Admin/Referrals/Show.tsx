import type { FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';

interface Option {
  id: number;
  name: string;
}

interface GeneratedLead {
  id: number;
  name: string;
  email: string;
  status?: string;
  created: string;
}

interface ShowProps {
  referral: {
    id: number;
    code: string;
    referrer_name: string;
    referrer_email: string;
    referrer_phone: string;
    referrer_user: string | null;
    referred_name: string;
    referred_email: string | null;
    referred_phone: string;
    property?: string;
    sale_amount: string | number | null;
    commission_percentage: string | number;
    commission_amount: string | number | null;
    commission_paid_at: string | null;
    status: { id: number; name: string; color: string } | null;
  };
  leads: GeneratedLead[];
  statuses: Option[];
  canChangeStatus: boolean;
  canManageCommission: boolean;
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

const labelClass = 'block text-xs text-gray-muted mb-1';
const valueClass = 'text-sm text-gray-text';
const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm';

export default function Show() {
  const { referral, leads, statuses, canChangeStatus, canManageCommission, flash } = usePage<ShowProps>().props;

  const statusForm = useForm({ status_id: referral.status?.id.toString() ?? '' });
  const commissionForm = useForm({
    sale_amount: referral.sale_amount?.toString() ?? '',
    commission_percentage: referral.commission_percentage?.toString() ?? '0',
    commission_paid_at: referral.commission_paid_at ?? '',
  });

  const changeStatus = (e: FormEvent) => {
    e.preventDefault();
    statusForm.patch(route('admin.referidos.status', referral.id), { preserveScroll: true });
  };

  const saveCommission = (e: FormEvent) => {
    e.preventDefault();
    commissionForm.patch(route('admin.referidos.commission', referral.id), { preserveScroll: true });
  };

  return (
    <AdminLayout>
      <Head title={`Referido ${referral.code}`} />

      <div className="mb-6">
        <Link href={route('admin.referidos.index')} className="text-sm text-navy hover:underline">
          ← Volver a referidos
        </Link>
        <div className="mt-1 flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-medium text-gray-text">
            {referral.referrer_name} → {referral.referred_name}
          </h1>
          {referral.status && (
            <span
              className="rounded-full px-2 py-0.5 text-xs text-white"
              style={{ backgroundColor: referral.status.color }}
            >
              {referral.status.name}
            </span>
          )}
        </div>
        <p className="mt-1 font-mono text-sm text-gray-muted">Código: {referral.code}</p>
      </div>

      {flash?.success && (
        <p className="mb-4 max-w-2xl rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{flash.success}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
        <section className="space-y-4 rounded-xl bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-muted">Quien refiere</h2>
          <div>
            <span className={labelClass}>Nombre</span>
            <p className={valueClass}>{referral.referrer_name}</p>
          </div>
          <div>
            <span className={labelClass}>Email / Teléfono</span>
            <p className={valueClass}>{referral.referrer_email} · {referral.referrer_phone}</p>
          </div>
          {referral.referrer_user && (
            <div>
              <span className={labelClass}>Usuario registrado</span>
              <p className={valueClass}>{referral.referrer_user}</p>
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-xl bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-muted">Referido</h2>
          <div>
            <span className={labelClass}>Nombre</span>
            <p className={valueClass}>{referral.referred_name}</p>
          </div>
          <div>
            <span className={labelClass}>Email / Teléfono</span>
            <p className={valueClass}>{referral.referred_email ?? '—'} · {referral.referred_phone}</p>
          </div>
          {referral.property && (
            <div>
              <span className={labelClass}>Propiedad de interés</span>
              <p className={valueClass}>{referral.property}</p>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          {canChangeStatus && (
            <form onSubmit={changeStatus} className="rounded-xl bg-white p-4 shadow">
              <label htmlFor="status_id" className={labelClass}>Cambiar estado</label>
              <select
                id="status_id"
                value={statusForm.data.status_id}
                onChange={(e) => statusForm.setData('status_id', e.target.value)}
                className={inputClass}
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

          {canManageCommission ? (
            <form onSubmit={saveCommission} className="space-y-3 rounded-xl bg-white p-4 shadow">
              <h2 className="text-sm font-medium text-gray-muted">Comisión</h2>
              <div>
                <label htmlFor="sale_amount" className={labelClass}>Monto de venta</label>
                <input id="sale_amount" type="number" min="0" step="0.01" value={commissionForm.data.sale_amount} onChange={(e) => commissionForm.setData('sale_amount', e.target.value)} className={inputClass} />
                {commissionForm.errors.sale_amount && (
                  <p className="mt-1 text-sm text-red-600">{commissionForm.errors.sale_amount}</p>
                )}
              </div>
              <div>
                <label htmlFor="commission_percentage" className={labelClass}>% comisión *</label>
                <input id="commission_percentage" type="number" min="0" max="100" step="0.01" value={commissionForm.data.commission_percentage} onChange={(e) => commissionForm.setData('commission_percentage', e.target.value)} className={inputClass} />
                {commissionForm.errors.commission_percentage && (
                  <p className="mt-1 text-sm text-red-600">{commissionForm.errors.commission_percentage}</p>
                )}
              </div>
              <div>
                <label htmlFor="commission_paid_at" className={labelClass}>Fecha de pago</label>
                <input id="commission_paid_at" type="date" value={commissionForm.data.commission_paid_at} onChange={(e) => commissionForm.setData('commission_paid_at', e.target.value)} className={inputClass} />
              </div>
              {referral.commission_amount && (
                <p className="text-sm text-gray-text">
                  Calculada: {referral.commission_amount} ({referral.commission_percentage}%)
                </p>
              )}
              <button
                type="submit"
                disabled={commissionForm.processing}
                className="w-full rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
              >
                Guardar comisión
              </button>
            </form>
          ) : (
            <div className="rounded-xl bg-white p-4 shadow text-sm text-gray-muted">
              Comisión: {referral.commission_amount ?? '—'} ({referral.commission_percentage}%)
              {referral.commission_paid_at ? ` · pagada el ${referral.commission_paid_at}` : ''}
            </div>
          )}
        </aside>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-medium text-gray-text">
        Leads generados ({leads.length})
      </h2>
      <div className="max-w-4xl overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-muted">
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium text-right">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b last:border-0 hover:bg-gray-bg/50">
                <td className="px-4 py-3 font-medium text-gray-text">
                  {l.name}
                  <span className="block text-xs font-normal text-gray-muted">{l.email}</span>
                </td>
                <td className="px-4 py-3 text-gray-muted">{l.status ?? '—'}</td>
                <td className="px-4 py-3 text-gray-muted">{l.created}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={route('admin.leads.show', l.id)} className="text-navy hover:underline">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-muted">
                  Este referido aún no generó leads.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
