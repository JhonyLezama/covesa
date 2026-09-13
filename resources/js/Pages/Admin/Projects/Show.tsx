import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';

interface AssociatedProperty {
  id: number;
  title: string;
  operation: string;
  is_published: boolean;
  type?: string;
  zone?: string;
  status?: string;
}

interface ShowProps {
  project: {
    id: number;
    name: string;
    slug: string;
    client_name: string | null;
    service_type: string | null;
    is_published: boolean;
    zone?: string;
    status: { name: string; color: string } | null;
    media_count: number;
  };
  properties: AssociatedProperty[];
  canEdit: boolean;
  [key: string]: unknown;
}

export default function Show() {
  const { project, properties, canEdit } = usePage<ShowProps>().props;

  return (
    <AdminLayout>
      <Head title={project.name} />

      <div className="mb-6">
        <Link href={route('admin.proyectos.index')} className="text-sm text-navy hover:underline">
          ← Volver a proyectos
        </Link>
        <div className="mt-1 flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-medium text-gray-text">{project.name}</h1>
          {project.status && (
            <span
              className="rounded-full px-2 py-0.5 text-xs text-white"
              style={{ backgroundColor: project.status.color }}
            >
              {project.status.name}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-muted">
          {project.zone} · {project.client_name ?? 'Sin cliente'} · {project.media_count} fotos ·{' '}
          {project.is_published ? 'publicado' : 'borrador'}
        </p>
        {canEdit && (
          <Link
            href={route('admin.proyectos.edit', project.id)}
            className="mt-3 inline-block rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
          >
            Editar proyecto
          </Link>
        )}
      </div>

      <h2 className="mb-3 text-lg font-medium text-gray-text">
        Propiedades asociadas ({properties.length})
      </h2>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-muted">
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Tipo / Zona</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              {canEdit && <th className="px-4 py-3 font-medium text-right">Ficha</th>}
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-bg/50">
                <td className="px-4 py-3 font-medium text-gray-text">
                  {p.title}
                  <span className="ml-2 text-xs font-normal text-gray-muted">
                    {p.operation} · {p.is_published ? 'publicada' : 'borrador'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-muted">{p.type} / {p.zone}</td>
                <td className="px-4 py-3 text-gray-muted">{p.status ?? '—'}</td>
                {canEdit && (
                  <td className="px-4 py-3 text-right">
                    <Link href={route('admin.propiedades.edit', p.id)} className="text-navy hover:underline">
                      Editar
                    </Link>
                  </td>
                )}
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={canEdit ? 4 : 3} className="px-4 py-6 text-center text-gray-muted">
                  Sin propiedades asociadas. Asócialas desde la ficha de cada propiedad (campo Proyecto).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
