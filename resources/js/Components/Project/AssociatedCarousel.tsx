import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from '../PropertyCard';
import type { Property } from '../../types';
import { cn } from '../../lib/utils';

interface AssociatedCarouselProps {
  properties: Property[];
}

/**
 * Slider de lotes disponibles: 100% dinámico desde BD.
 * 2 visibles en móvil, 4 en desktop, con flechas y dots.
 */
export default function AssociatedCarousel({ properties }: AssociatedCarouselProps) {
  const [emblaRef, api] = useEmblaCarousel({ loop: true, align: 'start', duration: 20 });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    setSnaps(api.scrollSnapList());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  if (properties.length === 0) return null;

  return (
    <section className="py-14 bg-slate-50 border-t border-slate-200 font-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-navy uppercase tracking-tight">
              Lotes disponibles en este proyecto
            </h2>
            <p className="mt-1 text-sm text-gray-muted">
              {properties.length} {properties.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full border-2 border-navy text-navy flex items-center justify-center hover:bg-navy hover:text-white transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Siguiente"
              className="w-10 h-10 rounded-full border-2 border-navy text-navy flex items-center justify-center hover:bg-navy hover:text-white transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="overflow-hidden pt-2 pb-2">
          <div className="flex -ml-5">
            {properties.map((p) => (
              <div
                key={p.slug ?? p.title}
                className="min-w-0 shrink-0 grow-0 basis-1/2 pl-5 lg:basis-1/4"
              >
                <PropertyCard {...p} />
              </div>
            ))}
          </div>
        </div>

        {snaps.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {snaps.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Ir al grupo ${index + 1}`}
                className={cn(
                  'h-2.5 w-2.5 rounded-full transition-colors',
                  index === selected ? 'bg-navy' : 'bg-navy/25 hover:bg-navy/50',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
