import PropertyCard from './PropertyCard';
import PropertySearch, { type SearchFilters } from './PropertySearch';
import type { Property } from '../types';

interface PropertiesSectionProps {
  title?: string;
  subtitle?: string;
  properties?: Property[];
  onSearch?: (filters: SearchFilters) => void;
}

const sampleProperties = [
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
  title = 'Proyectos Destacados',
  subtitle = 'Descubre nuestras mejores opciones inmobiliarias en las ubicaciones más privilegiadas de Lima',
  properties,
  onSearch,
}: PropertiesSectionProps) {
  const list = properties ?? sampleProperties;
  return (
    <>
      <PropertySearch onSearch={onSearch} />
      <section className="bg-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-medium text-gray-text mb-2">{title}</h2>
            <p className="text-sm text-gray-muted max-w-lg mx-auto">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((property, index) => (
              <PropertyCard key={index} {...property} />
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="#proyectos"
              className="inline-flex items-center gap-2 border border-navy text-navy px-6 py-2.5 rounded-lg text-sm hover:bg-navy hover:text-white transition-colors"
            >
              Ver todos los proyectos
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
