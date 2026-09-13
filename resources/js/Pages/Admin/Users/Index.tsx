import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  position: string | null;
  is_active: boolean;
  roles: string[];
}

interface PaginatedUsers {
  data: AdminUser[];
  links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps {
  users: PaginatedUsers;
  filters: { role: string; status: string };
  roles: string[];
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

export default function Index() {
  const { users, filters, roles, flash } = usePage<IndexProps>().props;

  const applyFilters = (next: { role: string; status: string }) => {
    router.get(route('admin.usuarios.index'), next, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const toggle = (id: number) => {
    router.patch(route('admin.usuarios.toggle', id), {}, { preserveScroll: true });
  };

  const destroy = (name: string, id: number) => {
    if (window.confirm(`¿Eliminar a ${name}? Se conserva su historial (eliminación lógica).`)) {
      router.delete(route('admin.usuarios.destroy', id), { preserveScroll: true });
    }
  };

  return (
    <AdminLayout>
      <Head title="Usuarios" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-text">Usuarios</h1>
        <Link
          href={route('admin.usuarios.create')}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
        >
          Nuevo usuario
        </Link>
      </div>

      {flash?.success && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{flash.success}</p>
      )}
      {flash?.error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{flash.error}</p>
      )}

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <select
          value={filters.role}
          onChange={(e) => applyFilters({ ...filters, role: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => applyFilters({ ...filters, status: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-muted">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-gray-bg/50">
                <td className="px-4 py-3 font-medium text-gray-text">{u.name}</td>
                <td className="px-4 py-3 text-gray-muted">{u.email}</td>
                <td className="px-4 py-3 text-gray-muted">{u.roles.join(', ') || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {u.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link
                    href={route('admin.usuarios.edit', u.id)}
                    className="mr-3 text-navy hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggle(u.id)}
                    className="mr-3 text-gray-muted hover:underline"
                  >
                    {u.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => destroy(u.name, u.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {users.data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-muted">
                  Sin usuarios para estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {users.links.length > 3 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {users.links.map((l, i) => (
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
