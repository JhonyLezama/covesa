import { Ruler, Lightbulb } from 'lucide-react';
import type { Property } from '../types';

export default function PropertyCard({
  image,
  title,
  type,
  location,
  area,
  lots,
  idealFor,
  status,
  price,
  href = '#',
}: Property) {
  const operationLabel = status === 'venta' ? 'En Venta' : status === 'alquiler' ? 'En Alquiler' : status;

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col font-display">
      <div className="relative h-60 w-full overflow-hidden">
        <img alt={title} src={image} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute top-4 left-4 flex flex-col items-start gap-1.5">
          <span className="bg-navy text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
            {type || location || 'Propiedad'}
          </span>
          <span className="bg-gold text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
            {operationLabel}
          </span>
        </div>
      </div>

      <div className="bg-navy text-white p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-black mb-4 tracking-tight">{title}</h3>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-start gap-2">
                <Ruler size={14} className="text-gold mt-0.5 shrink-0" />
                <div>
                  <span className="text-gray-300 text-[10px] block">Área total:</span>
                  <strong className="text-sm font-bold text-white">{area}</strong>
                </div>
              </div>
              {lots != null && (
                <div className="border-l border-white/20 pl-2">
                  <span className="text-gray-300 text-[10px] block">
                    Posibilidad de {status === 'alquiler' ? 'alquiler' : 'venta'}:
                  </span>
                  <strong className="text-sm font-bold text-white">{lots} Lotes</strong>
                </div>
              )}
            </div>
            {idealFor && (
              <div className="flex items-start gap-2 pt-1 border-t border-white/20">
                <Lightbulb size={14} className="text-gold mt-0.5 shrink-0" />
                <div>
                  <strong className="text-gold">Ideal para: </strong>
                  <span className="text-gray-200">{idealFor}</span>
                </div>
              </div>
            )}
            {price && <p className="text-sm font-bold text-white">{price}</p>}
          </div>
          <div className="mt-6 text-center">
            <a
              href={href}
              className="inline-block w-full py-2 px-4 rounded-full border border-white text-xs font-bold text-white hover:bg-white hover:text-navy transition duration-200"
            >
              Más información
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
