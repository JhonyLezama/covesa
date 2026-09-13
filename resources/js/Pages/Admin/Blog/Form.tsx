import type { FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '../../../Layouts/AdminLayout';
import MediaManager from '../../../Components/MediaManager';
import type { MediaItem } from '../../../Components/MediaManager';
import RichEditor from '../../../Components/RichEditor';

interface EditPost {
  id: number;
  slug: string;
  category: string | null;
  published_at: string | null;
  is_published: boolean;
  title: string | null;
  excerpt: string | null;
  content: string | null;
}

interface FormProps {
  post: EditPost | null;
  media?: MediaItem[];
  categories: string[];
  errors?: Record<string, string>;
  [key: string]: unknown;
}

const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none';
const labelClass = 'block text-sm font-medium text-gray-text mb-1';
const errorClass = 'mt-1 text-sm text-red-600';

export default function Form() {
  const { post, media, categories, errors } = usePage<FormProps>().props;
  const isEdit = post !== null;

  const { data, setData, post: submitPost, put, processing } = useForm({
    slug: post?.slug ?? '',
    category: post?.category ?? '',
    published_at: post?.published_at ?? '',
    is_published: post?.is_published ?? false,
    title: post?.title ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isEdit) put(route('admin.blog.update', post!.id));
    else submitPost(route('admin.blog.store'));
  };

  return (
    <AdminLayout>
      <Head title={isEdit ? 'Editar post' : 'Nuevo post'} />

      <div className="mb-6">
        <Link href={route('admin.blog.index')} className="text-sm text-navy hover:underline">
          ← Volver al blog
        </Link>
        <h1 className="mt-1 text-2xl font-medium text-gray-text">
          {isEdit ? 'Editar post' : 'Nuevo post'}
        </h1>
      </div>

      <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow">
        <div>
          <label htmlFor="title" className={labelClass}>Título *</label>
          <input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
          {errors?.title && <p className={errorClass}>{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>Slug (vacío = automático desde el título)</label>
          <input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} className={inputClass} />
          {errors?.slug && <p className={errorClass}>{errors.slug}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={labelClass}>Categoría (texto libre)</label>
            <input
              id="category"
              list="blog-categories"
              placeholder="Noticias de Moche"
              value={data.category}
              onChange={(e) => setData('category', e.target.value)}
              className={inputClass}
            />
            <datalist id="blog-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors?.category && <p className={errorClass}>{errors.category}</p>}
          </div>
          <div>
            <label htmlFor="published_at" className={labelClass}>Fecha de publicación</label>
            <input id="published_at" type="date" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} className={inputClass} />
            {errors?.published_at && <p className={errorClass}>{errors.published_at}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="excerpt" className={labelClass}>Extracto</label>
          <textarea id="excerpt" rows={2} value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} className={inputClass} />
          {errors?.excerpt && <p className={errorClass}>{errors.excerpt}</p>}
        </div>

        <div>
          <span className={labelClass}>Contenido *</span>
          <RichEditor value={data.content} onChange={(html) => setData('content', html)} />
          {errors?.content && <p className={errorClass}>{errors.content}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-text">
          <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
          Publicado
        </label>

        <button
          type="submit"
          disabled={processing}
          className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
        >
          {processing ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear post'}
        </button>
      </form>

      {isEdit && (
        <div className="max-w-2xl">
          <MediaManager
            parentId={post!.id}
            parentLabel={post!.title ?? `Post #${post!.id}`}
            initialMedia={media ?? []}
            routes={{
              store: 'admin.blog.media.store',
              reorder: 'admin.blog.media.reorder',
              featured: 'admin.blog.media.featured',
              destroy: 'admin.blog.media.destroy',
            }}
          />
        </div>
      )}
    </AdminLayout>
  );
}
