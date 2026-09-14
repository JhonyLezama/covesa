import { Sprout } from 'lucide-react';

interface ElMilagroHeroProps {
  title: string;
  heroImage: string | null;
  logoUrl?: string | null;
  badge?: { top: string | null; title: string } | null;
}

export default function ElMilagroHero({ title, heroImage, logoUrl, badge }: ElMilagroHeroProps) {
  return (
    <header className="relative w-full overflow-hidden bg-slate-900">
      <div className="relative w-full h-[360px] md:h-[460px] lg:h-[540px] bg-cover bg-center overflow-hidden">
        {heroImage ? (
          <img
            alt={title}
            src={heroImage}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0C447C] to-[#1A5A9E]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Esquina superior: logo subido desde el panel; si no hay,
            distintivo icono + texto (textos editables en Admin → Proyectos),
            igual que el badge del slider del home. */}
        <div className="absolute top-6 right-6 md:top-10 md:right-16 z-20 flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={badge?.title ?? title} className="h-12 md:h-16 w-auto rounded-xl bg-black/20 px-2 py-1" />
          ) : (
            <span className="inline-flex items-center gap-2.5 rounded-md bg-[#3DAD2C] px-3 py-1.5 text-white shadow-md">
              <Sprout size={26} aria-hidden="true" className="shrink-0" />
              <span className="text-right leading-tight">
                {badge?.top && (
                  <span className="block text-[9px] md:text-[10px] font-medium uppercase tracking-wider opacity-90">
                    {badge.top}
                  </span>
                )}
                <span className="block text-sm md:text-lg font-black uppercase tracking-wide">
                  {badge?.title ?? title}
                </span>
              </span>
            </span>
          )}
        </div>

        <div className="absolute bottom-12 left-4 md:left-14 z-20 max-w-2xl">
          <div className="inline-block min-w-[280px] md:min-w-[440px] bg-[#3DAD2C] text-white font-extrabold px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-lg -rotate-[4deg] origin-bottom-left border-2 border-white/40">
            <p className="text-left text-base md:text-lg tracking-wider uppercase opacity-95 leading-tight [text-shadow:1px_2px_0_rgba(0,0,0,0.35)]">
              Tu oportunidad de hacer
            </p>
            <h2 className="text-right text-xl md:text-3xl font-black uppercase tracking-wide leading-tight [text-shadow:2px_3px_0_rgba(0,0,0,0.35)]">
              Crecer tu negocio
            </h2>
          </div>
        </div>
      </div>
    </header>
  );
}
