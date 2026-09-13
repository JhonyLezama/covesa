import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import type { AuthUser } from '../../types';

interface DashboardProps {
  auth: { user: AuthUser | null };
  [key: string]: unknown;
}

export default function Dashboard() {
  const { auth } = usePage<DashboardProps>().props;

  return (
    <AdminLayout>
      <Head title="Panel" />
      <h1 className="text-2xl font-medium text-gray-text">
        Hola, {auth.user?.name}
      </h1>
      <p className="mt-2 text-sm text-gray-muted">
        Roles: {auth.user?.roles.join(', ')} · Permisos: {auth.user?.permissions.join(', ')}
      </p>
      <p className="mt-4 text-sm text-gray-muted">
        Día 1 verificado: sesión + roles base. El CRUD del CMS llega en el Día 2.
      </p>
    </AdminLayout>
  );
}
