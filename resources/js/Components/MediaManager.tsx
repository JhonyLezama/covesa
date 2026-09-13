import { useEffect, useState } from 'react';
import type { DragEvent } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export interface MediaItem {
  id: number;
  type: string;
  url: string;
  order: number;
}

interface MediaRoutes {
  store: string;
  reorder: string;
  featured: string;
  destroy: string;
}

interface MediaManagerProps {
  parentId: number;
  parentLabel: string;
  initialMedia: MediaItem[];
  routes: MediaRoutes;
}

export default function MediaManager({ parentId, parentLabel, initialMedia, routes }: MediaManagerProps) {
  const [items, setItems] = useState<MediaItem[]>(initialMedia);
  const [dragging, setDragging] = useState(false);
  const { flash, errors } = usePage<{ flash?: { success?: string; error?: string }; errors?: Record<string, string> }>().props;

  useEffect(() => {
    setItems(initialMedia);
  }, [initialMedia]);

  const upload = useForm<{ photos: File[] }>({ photos: [] });

  const sendFiles = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (images.length === 0) return;
    upload.setData('photos', images);
    upload.post(route(routes.store, parentId), {
      preserveScroll: true,
      onSuccess: () => {
        upload.reset('photos');
        router.reload({ only: ['media'] });
      },
    });
  };

  const drop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    sendFiles(Array.from(e.dataTransfer.files));
  };

  const setFeatured = (id: number) => {
    router.patch(route(routes.featured, [parentId, id]), {}, { preserveScroll: true });
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    router.patch(
      route(routes.reorder, parentId),
      { ids: next.map((m) => m.id) },
      { preserveScroll: true },
    );
  };

  const destroy = (id: number) => {
    if (window.confirm('¿Eliminar esta foto de la galería? Se borra el archivo.')) {
      router.delete(route(routes.destroy, [parentId, id]), { preserveScroll: true });
    }
  };

  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-text">Galería de fotos — {parentLabel}</h2>
      <p className="mt-1 text-sm text-gray-muted">
        Arrastra imágenes o haz clic para seleccionar (máx. 10 por vez, 5MB c/u). Se optimizan solas.
      </p>

      {flash?.success && (
        <p className="mt-3 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{flash.success}</p>
      )}
      {(errors?.photos ?? errors?.['photos.0']) && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {errors.photos ?? errors['photos.0']}
        </p>
      )}

      <label
        onDrop={drop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        className={`mt-4 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-sm ${
          dragging ? 'border-navy bg-navy/5 text-navy' : 'border-gray-300 text-gray-muted'
        }`}
      >
        {upload.processing ? 'Subiendo…' : 'Arrastra fotos aquí o haz clic para elegirlas'}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => sendFiles(Array.from(e.target.files ?? []))}
        />
      </label>

      {items.length === 0 && (
        <p className="mt-4 text-sm text-gray-muted">Aún sin fotos. La primera que subas será la portada.</p>
      )}

      <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((m, i) => (
          <li key={m.id} className="overflow-hidden rounded-lg border">
            <div className="relative">
              <img src={m.url} alt="" className="h-36 w-full object-cover" />
              {m.type === 'featured' && (
                <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-xs font-medium text-white">
                  Portada
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 p-2 text-xs">
              {m.type !== 'featured' && (
                <button type="button" onClick={() => setFeatured(m.id)} className="text-navy hover:underline">
                  Portada
                </button>
              )}
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-muted hover:underline disabled:opacity-40">
                ←
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-gray-muted hover:underline disabled:opacity-40">
                →
              </button>
              <button type="button" onClick={() => destroy(m.id)} className="ml-auto text-red-600 hover:underline">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
