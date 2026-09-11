import { MapPin, Maximize2, ArrowRight } from 'lucide-react';

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  area: string;
  idealFor?: string;
  status: 'venta' | 'alquiler' | 'concluido' | 'construccion';
  price?: string;
  href?: string;
}

const statusConfig = {
  venta: { label: 'En venta', className: 'bg-gold text-navy-dark' },
  alquiler: { label: 'En alquiler', className: 'bg-navy text-white' },
  concluido: { label: 'Concluido', className: 'bg-green-600 text-white' },
  construccion: { label: 'En construcción', className: 'bg-orange-500 text-white' },
};

export default function PropertyCard({
  image,
  title,
  location,
  area,
  idealFor,
  status,
  price,
  href = '#',
}: PropertyCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge */}
        <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-md font-medium ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
        {/* Price overlay */}
        {price && (
          <div className="absolute bottom-3 right-3 bg-navy-dark/85 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-md">
            {price}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base font-medium text-gray-text mb-2 line-clamp-1">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-muted mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-navy" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={14} className="text-navy" />
            {area}
          </span>
        </div>

        {idealFor && (
          <p className="text-sm text-gray-muted mb-4">
            <span className="text-navy font-medium">Ideal para:</span> {idealFor}
          </p>
        )}

        <a
          href={href}
          className="inline-flex items-center gap-1.5 text-sm text-navy font-medium hover:text-navy-dark transition-colors group/link"
        >
          Más información
          <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
