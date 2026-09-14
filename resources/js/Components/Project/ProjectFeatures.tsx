import { Store, Warehouse, Landmark, Building, Building2, Download } from 'lucide-react';
import { renderHighlights } from '../../lib/highlights';

interface ProjectFeaturesProps {
  description: string | null;
  features: string[];
  brochureUrl: string | null;
}

const ZONE_ICONS = [Store, Warehouse, Landmark, Building, Building2];

const DEFAULT_ZONES = [
  'Zona Minorista',
  'Zona Mayorista',
  'Zona Financiera',
  'Zona Comercial 1',
  'Zona Comercial 2',
];

export default function ProjectFeatures({ description, features, brochureUrl }: ProjectFeaturesProps) {
  const zones = features.length > 0 ? features : DEFAULT_ZONES;

  return (
    <section className="relative bg-amber-500/10 py-12 lg:py-16 overflow-hidden border-b border-amber-200">
      <div className="absolute inset-0 bg-gradient-to-r from-[#e78d2b] via-[#e58620] to-[#f39c38] opacity-95" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left text-white relative">
            <div className="z-10 mb-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md">
                Características
              </h2>
              <div className="inline-block bg-[#2F8F4E] px-5 py-2 rounded-2xl mt-1 shadow-lg border border-white/30">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase text-white tracking-wide">
                  Del proyecto
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
            {description && (
              <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed mb-8 whitespace-pre-line">
                {renderHighlights(description, 'font-bold text-slate-900 uppercase')}
              </p>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 text-center mb-8">
              {zones.slice(0, 5).map((zone, i) => {
                const Icon = ZONE_ICONS[i % ZONE_ICONS.length];
                return (
                  <div key={zone} className="flex flex-col items-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-50 text-[#2F8F4E] flex items-center justify-center mb-2 shadow-sm border border-emerald-100">
                      <Icon size={28} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-[#2F8F4E] uppercase tracking-tighter leading-tight">
                      {zone}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              {brochureUrl ? (
                <a
                  href={brochureUrl}
                  download
                  className="inline-flex items-center gap-2 bg-[#F2A623] hover:bg-[#d98f1a] text-white font-bold px-6 py-3 rounded-xl transition duration-200 shadow-md"
                >
                  <Download size={20} />
                  <span>Descargar Brochure</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 bg-gray-300 text-white font-bold px-6 py-3 rounded-xl cursor-not-allowed">
                  <Download size={20} />
                  <span>Brochure pronto</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
