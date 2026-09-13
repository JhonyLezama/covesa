import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface PropertySearchProps {
  onSearch?: (filters: SearchFilters) => void;
  tabs?: { label: string; value: string }[];
  placeholder?: string;
  typeOptions?: { slug: string; name: string }[];
  locationOptions?: { slug: string; name: string }[];
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

const purposeOptions = [
  { value: 'almacenes', label: 'Almacenes y logística' },
  { value: 'locales', label: 'Locales de venta' },
  { value: 'residencial', label: 'Desarrollo residencial' },
];

const priceOptions = [
  { value: '10000-50000', label: '$10,000 - $50,000' },
  { value: '50000-200000', label: '$50,000 - $200,000' },
  { value: '200000+', label: '> $200,000' },
];

const selectClass =
  'w-full bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-navy-light';

function SelectChevron() {
  return <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />;
}

export default function PropertySearch({
  onSearch,
  tabs = defaultTabs,
  placeholder = 'Buscar por nombre, ubicación o tipo...',
  typeOptions,
  locationOptions,
}: PropertySearchProps) {
  const [activeTab, setActiveTab] = useState('todos');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    tab: 'todos',
    type: '',
    location: '',
    purpose: '',
    priceRange: '',
    q: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const emit = (next: SearchFilters) => {
    setFilters(next);
    onSearch?.(next);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    emit({ ...filters, tab: value, q: searchQuery });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    emit({ ...filters, [key]: value, q: searchQuery });
  };

  const handleSearch = () => {
    emit({ ...filters, tab: activeTab, q: searchQuery });
  };

  const clearFilters = () => {
    setSearchQuery('');
    emit({ tab: activeTab, type: '', location: '', purpose: '', priceRange: '', q: '' });
  };

  return (
    <section className="bg-gray-50/50 font-display">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Buscador libre (mejora funcional: el original no lo trae) */}
        <div className="flex items-center gap-2 pt-2 pb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-muted hover:text-gray-text"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-sm text-navy hover:text-navy-light transition-colors shrink-0"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {showFilters && (
          <>
            {/* Tabs shadcn adheridos a la barra */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="ml-1">
              <TabsList className="bg-transparent p-0 gap-2 flex-wrap h-auto">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="px-6 py-2 text-xs rounded-t-lg rounded-b-none shadow-none data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:font-bold data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Barra única de filtros */}
            <div className="bg-navy/5 border border-navy/10 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="w-full md:w-1/5 relative">
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className={selectClass}
                    aria-label="Tipo de propiedad"
                  >
                    <option value="">Tipo</option>
                    {(typeOptions ?? []).map((t) => (
                      <option key={t.slug} value={t.slug}>{t.name}</option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
                <div className="w-full md:w-1/5 relative">
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className={selectClass}
                    aria-label="Lugar"
                  >
                    <option value="">Lugar</option>
                    {(locationOptions ?? []).map((z) => (
                      <option key={z.slug} value={z.slug}>{z.name}</option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
                <div className="w-full md:w-1/4 relative">
                  <select
                    value={filters.purpose}
                    onChange={(e) => handleFilterChange('purpose', e.target.value)}
                    className={selectClass}
                    aria-label="¿Para qué lo quiero?"
                  >
                    <option value="">¿Para qué lo quiero?</option>
                    {purposeOptions.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
                <div className="w-full md:w-1/6 relative">
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className={selectClass}
                    aria-label="Precio"
                  >
                    <option value="">Precio</option>
                    {priceOptions.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <SelectChevron />
                </div>
                <div className="w-full md:w-auto flex items-center gap-2">
                  <button
                    onClick={handleSearch}
                    className="w-full md:w-auto px-6 py-2.5 bg-navy hover:bg-navy-light text-white rounded-lg font-bold text-xs shadow transition"
                  >
                    Buscar
                  </button>
                  <button
                    onClick={clearFilters}
                    aria-label="Limpiar filtros"
                    className="p-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
