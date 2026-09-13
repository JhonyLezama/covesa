import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import PropertyCard from './PropertyCard';
import PropertySearch, { type SearchFilters } from './PropertySearch';
import type { Property } from '../types';

interface PropertiesSectionProps {
  title?: string;
  subtitle?: string;
  properties?: Property[];
  onSearch?: (filters: SearchFilters) => void;
  hasMore?: boolean;
  remaining?: number;
  onLoadMore?: () => void;
  filterOptions?: {
    types: { slug: string; name: string }[];
    zones: { slug: string; name: string }[];
  };
}

const sampleProperties: Property[] = [
  {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    title: 'Torre San Isidro — Departamentos de lujo',
    location: 'San Isidro',
    area: '85 - 220 m²',
    idealFor: 'Familias y ejecutivos que buscan exclusividad',
    status: 'venta' as const,
    price: 'Desde $185,000',
    href: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    title: 'Centro Empresarial Javier Prado',
    location: 'San Isidro',
    area: '150 - 500 m²',
    idealFor: 'Empresas que buscan oficinas premium',
    status: 'alquiler' as const,
    price: '$25/m²',
    href: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    title: 'Residencial La Molina — Casas independientes',
    location: 'La Molina',
    area: '250 - 400 m²',
    idealFor: 'Familias que buscan espacio y tranquilidad',
    status: 'construccion' as const,
    price: 'Desde $420,000',
    href: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    title: 'Plaza Comercial Surco',
    location: 'Surco',
    area: '80 - 300 m²',
    idealFor: 'Retail, restaurantes y servicios',
    status: 'venta' as const,
    price: 'Desde $320,000',
    href: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    title: 'Miraflores Ocean View — Penthouse',
    location: 'Miraflores',
    area: '180 m²',
    idealFor: 'Inversionistas y compradores exclusivos',
    status: 'concluido' as const,
    price: '$750,000',
    href: '#',
  },
  {
    image: 'https://images.unsplash.com/photo-1582407947092-40a4e4e00daa?w=600&q=80',
    title: 'Nave Industrial ATE — Parque Industrial',
    location: 'Ate',
    area: '1,000 - 5,000 m²',
    idealFor: 'Logística, manufactura y almacenamiento',
    status: 'alquiler' as const,
    price: '$8/m²',
    href: '#',
  },
];

export default function PropertiesSection({
  title = 'Encuentra tu propiedad ideal',
  subtitle = 'Terrenos comerciales, industriales, locales comerciales e inmuebles residenciales.',
  properties,
  onSearch,
  hasMore = false,
  remaining = 0,
  onLoadMore,
  filterOptions,
}: PropertiesSectionProps) {
  const list = properties ?? sampleProperties;
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const offStart = router.on('start', () => setSearching(true));
    const offFinish = router.on('finish', () => setSearching(false));
    return () => {
      offStart();
      offFinish();
    };
  }, []);

  return (
    <>
      <div id="propiedades" className="bg-gray-50/50 pt-14 pb-6 px-4 text-center font-display">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy tracking-tight mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">
          Terrenos comerciales, industriales, locales comerciales e inmuebles residenciales.
          <br className="hidden sm:inline" />
          ¡Da el primer paso hacia la compra de tu próximo hogar!
        </p>
      </div>
      <PropertySearch
        onSearch={onSearch}
        typeOptions={filterOptions?.types}
        locationOptions={filterOptions?.zones}
      />
      <section className="bg-gray-50/50 py-12 font-display">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searching && (
            <p className="mb-6 text-center text-sm text-navy" role="status">Buscando propiedades…</p>
          )}
          {list.length === 0 && !searching ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-bold text-navy">Sin resultados</p>
              <p className="mt-1 text-sm text-gray-muted">
                Prueba con otros filtros o limpia la búsqueda para ver todas las propiedades.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {list.map((property, index) => (
                <PropertyCard key={property.slug ?? index} {...property} />
              ))}
            </div>
          )}
          {/* Solo aparece si hay más por cargar: con 0 resultados o todo
              visible no se muestra. */}
          {hasMore && onLoadMore && list.length > 0 && (
            <div className="mt-12 text-center">
              <button
                onClick={onLoadMore}
                disabled={searching}
                className="inline-block px-8 py-2.5 rounded-full border-2 border-navy text-navy font-bold text-xs uppercase tracking-wide hover:bg-navy hover:text-white transition shadow-sm disabled:opacity-60"
              >
                {searching ? 'Cargando…' : remaining > 0 ? `Ver más (${remaining})` : 'Ver más'}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
