import { Store, Warehouse, Landmark, Building, Building2, Download } from 'lucide-react';
import { renderHighlights } from '../../lib/highlights';

interface ProjectFeaturesProps {
  description: string | null;
  features: string[];
  brochureUrl: string | null;
  image?: string | null;
}

const ZONE_ICONS = [Store, Warehouse, Landmark, Building, Building2];

const DEFAULT_ZONES = [
  'Zona Minorista',
  'Zona Mayorista',
  'Zona Financiera',
  'Zona Comercial 1',
  'Zona Comercial 2',
];

function Mascot() {
  return (
    <img
      src="/images/el-milagro/mascota-comerciante.png"
      alt="Comerciante El Milagro"
      aria-hidden="true"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = 'none';
      }}
      className="pointer-events-none absolute bottom-0 left-1/2 z-10 hidden h-72 -translate-x-[85%] select-none md:block lg:h-96"
    />
  );
}

export default function ProjectFeatures({ description, features, brochureUrl, image }: ProjectFeaturesProps) {
  const zones = features.length > 0 ? features : DEFAULT_ZONES;

  return (
    <section className="relative overflow-hidden">
      <Mascot />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
          {image ? (
            <img
              src={image}
              alt="Centro comercial El Milagro"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-[#e78d2b]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#e78d2b]/95 via-[#e58620]/90 to-[#f39c38]/80" />
          <div className="relative flex h-full flex-col items-center justify-center px-6 py-10 text-center text-white sm:px-10 lg:items-start lg:p-12 lg:text-left">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white [text-shadow:0_4px_10px_rgba(0,0,0,0.35)] sm:text-3xl lg:text-4xl">
              Características
            </h2>
            <div className="mt-2 inline-block rounded-2xl border border-white/30 bg-[#3DAD2C] px-4 py-1.5 shadow-xl shadow-black/30">
              <span className="text-xl font-extrabold uppercase tracking-wide text-white [text-shadow:2px_3px_0_rgba(0,0,0,0.3)] sm:text-2xl lg:text-3xl">
                Del proyecto
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 px-6 py-10 sm:p-10 lg:p-14">
          <div className="w-full">
            {description && (
              <p className="mb-6 whitespace-pre-line text-xs leading-relaxed text-slate-700 sm:text-sm lg:text-base">
                {renderHighlights(description, 'font-extrabold uppercase text-[#e67319]')}
              </p>
            )}

            <div className="mb-8 grid grid-cols-3 gap-3 text-center sm:grid-cols-5 sm:gap-4">
              {zones.slice(0, 5).map((zone, i) => {
                const Icon = ZONE_ICONS[i % ZONE_ICONS.length];
                // Etiqueta en 2 líneas (primera palabra / resto) para un grid ordenado.
                const [first, ...rest] = zone.split(' ');
                return (
                  <div key={zone} className="flex flex-col items-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-[#2F8F4E] shadow-sm sm:h-14 sm:w-14">
                      <Icon size={28} />
                    </div>
                    <span className="text-[11px] font-bold uppercase leading-tight tracking-tighter text-[#e67319] sm:text-xs">
                      {first}
                      {rest.length > 0 && (
                        <>
                          <br />
                          {rest.join(' ')}
                        </>
                      )}
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
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F2A623] px-6 py-3 font-bold text-white shadow-md transition duration-200 hover:bg-[#d98f1a]"
                >
                  <Download size={20} />
                  <span>Descargar Brochure</span>
                </a>
              ) : (
                <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-gray-300 px-6 py-3 font-bold text-white">
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
