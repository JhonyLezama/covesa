import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';

interface PostRow {
  id: number;
  slug: string;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  title?: string;
  author?: string;
}

interface PaginatedPosts {
  data: PostRow[];
  links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps {
  posts: PaginatedPosts;
  filters: { q: string; category: string; published: string };
  categories: string[];
  canEdit: boolean;
  flash?: { success?: string; error?: string };
  [key: string]: unknown;
}

export default function Index() {
  const { posts, filters, categories, canEdit, flash } = usePage<IndexProps>().props;

  const applyFilters = (next: { q: string; category: string; published: string }) => {
    router.get(route('admin.blog.index'), next, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const destroy = (title: string | undefined, id: number) => {
    if (window.confirm(`¿Eliminar "${title ?? id}"? Se conserva su historial (eliminación lógica).`)) {
      router.delete(route('admin.blog.destroy', id), { preserveScroll: true });
    }
  };

  return (
    <AdminLayout>
      <Head title="Blog" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-text">Blog</h1>
        {canEdit && (
          <Link
            href={route('admin.blog.create')}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
          >
            Nuevo post
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
          placeholder="Buscar por título…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyFilters({ ...filters, q: (e.target as HTMLInputElement).value });
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.category}
          onChange={(e) => applyFilters({ ...filters, category: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.published}
          onChange={(e) => applyFilters({ ...filters, published: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="publicados">Publicados</option>
          <option value="borrador">Borrador</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-muted">
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoría / Autor</th>
              <th className="px-4 py-3 font-medium">Publicación</th>
              {canEdit && <th className="px-4 py-3 font-medium text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {posts.data.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-bg/50">
                <td className="px-4 py-3 font-medium text-gray-text">
                  {p.title ?? '(sin título)'}
                  <span className="ml-2 text-xs font-normal text-gray-muted">
                    {p.is_published ? 'publicado' : 'borrador'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-muted">{p.category ?? '—'} / {p.author ?? '—'}</td>
                <td className="px-4 py-3 text-gray-muted">{p.published_at ?? '—'}</td>
                {canEdit && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={route('admin.blog.edit', p.id)} className="mr-3 text-navy hover:underline">
                      Editar
                    </Link>
                    <button type="button" onClick={() => destroy(p.title, p.id)} className="text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {posts.data.length === 0 && (
              <tr>
                <td colSpan={canEdit ? 4 : 3} className="px-4 py-6 text-center text-gray-muted">
                  Sin posts para estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {posts.links.length > 3 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {posts.links.map((l, i) => (
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
