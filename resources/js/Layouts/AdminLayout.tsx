import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { auth } = usePage<{ auth: { user: AuthUser | null } }>().props;
  const user = auth.user;
  const can = (permission: string) => user?.permissions.includes(permission) ?? false;

  return (
    <div className="min-h-screen bg-gray-bg">
      <header className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={route('admin.dashboard')} className="font-medium">
            COVESA · Panel interno
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">{user?.name}</span>
            <button
              type="button"
              onClick={() => router.post(route('logout'))}
              className="text-sm underline underline-offset-2 hover:opacity-80"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <nav className="md:w-52 shrink-0">
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href={route('admin.dashboard')}
                className="block rounded-lg px-3 py-2 hover:bg-white text-gray-text"
              >
                Panel
              </Link>
            </li>
            {can('manage-users') && (
              <li>
                <Link
                  href={route('admin.usuarios.index')}
                  className="block rounded-lg px-3 py-2 hover:bg-white text-gray-text"
                >
                  Usuarios
                </Link>
              </li>
            )}
            <li>
              <Link
                href={route('admin.propiedades.index')}
                className="block rounded-lg px-3 py-2 hover:bg-white text-gray-text"
              >
                Propiedades
              </Link>
            </li>
            <li>
              <Link
                href={route('admin.proyectos.index')}
                className="block rounded-lg px-3 py-2 hover:bg-white text-gray-text"
              >
                Proyectos
              </Link>
            </li>
            <li>
              <Link
                href={route('admin.blog.index')}
                className="block rounded-lg px-3 py-2 hover:bg-white text-gray-text"
              >
                Blog
              </Link>
            </li>
            {(can('manage-leads') || can('manage-own-leads')) && (
              <li>
                <Link
                  href={route('admin.leads.index')}
                  className="block rounded-lg px-3 py-2 hover:bg-white text-gray-text"
                >
                  Leads
                </Link>
              </li>
            )}
            {(can('manage-leads') || can('manage-own-leads')) && (
              <li>
                <Link
                  href={route('admin.referidos.index')}
                  className="block rounded-lg px-3 py-2 hover:bg-white text-gray-text"
                >
                  Referidos
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
