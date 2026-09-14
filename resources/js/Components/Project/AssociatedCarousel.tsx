import PropertyCard from '../PropertyCard';
import type { Property } from '../../types';

interface AssociatedCarouselProps {
  properties: Property[];
}

/**
 * Carrusel de lotes disponibles: 100% dinámico desde BD.
 * Cada card varía según la propiedad (título, área, lotes, ideal_for).
 */
export default function AssociatedCarousel({ properties }: AssociatedCarouselProps) {
  if (properties.length === 0) return null;

  return (
    <section className="py-14 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-black text-navy uppercase tracking-tight mb-2 text-center">
          Lotes disponibles en este proyecto
        </h2>
        <p className="text-sm text-gray-muted text-center mb-8">
          {properties.length} {properties.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}
        </p>
        <div className="flex space-x-5 overflow-x-auto pb-6 pt-2">
          {properties.map((p) => (
            <div key={p.slug ?? p.title} className="flex-shrink-0 w-64 md:w-72">
              <PropertyCard {...p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
