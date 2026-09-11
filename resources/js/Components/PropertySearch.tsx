import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface PropertySearchProps {
  onSearch?: (filters: SearchFilters) => void;
  tabs?: { label: string; value: string }[];
  placeholder?: string;
}

export interface SearchFilters {
  tab: string;
  type: string;
  location: string;
  purpose: string;
  priceRange: string;
  q: string;
  [key: string]: string;
}

const defaultTabs = [
  { label: 'Todos', value: 'todos' },
  { label: 'Venta', value: 'venta' },
  { label: 'Alquiler', value: 'alquiler' },
];

export default function PropertySearch({
  onSearch,
  tabs = defaultTabs,
  placeholder = 'Buscar por nombre, ubicación o tipo...',
}: PropertySearchProps) {
  const [activeTab, setActiveTab] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    tab: 'todos',
    type: '',
    location: '',
    purpose: '',
    priceRange: '',
    q: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newFilters = { ...filters, tab: value, q: searchQuery };
    setFilters(newFilters);
    onSearch?.(newFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value, q: searchQuery };
    setFilters(newFilters);
    onSearch?.(newFilters);
  };

  const handleSearch = () => {
    onSearch?.({ ...filters, tab: activeTab, q: searchQuery });
  };

  const clearFilters = () => {
    setFilters({ tab: activeTab, type: '', location: '', purpose: '', priceRange: '', q: '' });
    setSearchQuery('');
    onSearch?.({ tab: activeTab, type: '', location: '', purpose: '', priceRange: '', q: '' });
  };

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 bg-gray-bg rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`text-sm px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.value
                    ? 'bg-navy text-white'
                    : 'text-gray-muted hover:text-gray-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-sm text-navy hover:text-navy-dark transition-colors"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-muted hover:text-gray-text"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-navy text-white px-5 py-3 rounded-lg text-sm hover:bg-navy-dark transition-colors hidden sm:block"
          >
            Buscar
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-muted mb-1.5">Tipo de propiedad</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-white"
                >
                  <option value="">Todos los tipos</option>
                  <option value="departamento">Departamento</option>
                  <option value="casa">Casa</option>
                  <option value="oficina">Oficina</option>
                  <option value="local-comercial">Local comercial</option>
                  <option value="terreno">Terreno</option>
                  <option value="nave-industrial">Nave industrial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-muted mb-1.5">Ubicación</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-white"
                >
                  <option value="">Todas las zonas</option>
                  <option value="san-isidro">San Isidro</option>
                  <option value="miraflores">Miraflores</option>
                  <option value="surco">Surco</option>
                  <option value="la-molina">La Molina</option>
                  <option value="barranco">Barranco</option>
                  <option value="san-borja">San Borja</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-muted mb-1.5">Propósito</label>
                <select
                  value={filters.purpose}
                  onChange={(e) => handleFilterChange('purpose', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-white"
                >
                  <option value="">Todos</option>
                  <option value="vivienda">Vivienda</option>
                  <option value="inversion">Inversión</option>
                  <option value="comercial">Comercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-muted mb-1.5">Rango de precio</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-white"
                >
                  <option value="">Sin límite</option>
                  <option value="0-100000">Hasta $100,000</option>
                  <option value="100000-200000">$100,000 - $200,000</option>
                  <option value="200000-400000">$200,000 - $400,000</option>
                  <option value="400000-700000">$400,000 - $700,000</option>
                  <option value="700000+">Más de $700,000</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-muted hover:text-gray-text transition-colors"
              >
                Limpiar filtros
              </button>
              <button
                onClick={handleSearch}
                className="bg-navy text-white px-5 py-2 rounded-lg text-sm hover:bg-navy-dark transition-colors sm:hidden"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
