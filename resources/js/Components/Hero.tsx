import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '../lib/utils';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
}

interface HeroProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number;
  overlayTone?: string;
  overlayIntensity?: string;
}

const defaultSlides: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
    title: 'La manera perfecta de hacer negocios inmobiliarios',
    subtitle: 'Más de 35 años de experiencia en el mercado inmobiliario peruano.',
    cta: { label: 'Más información', href: '#propiedades' },
  },
  {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
    title: 'Proyectos que transforman ciudades',
    subtitle: 'Terrenos comerciales, industriales y locales en las mejores ubicaciones.',
    cta: { label: 'Más información', href: '#propiedades' },
  },
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    title: 'Espacios corporativos e industriales',
    subtitle: 'Soluciones inmobiliarias para empresas que crecen.',
    cta: { label: 'Más información', href: '#propiedades' },
  },
  {
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
    title: 'Vende tu propiedad con nosotros',
    subtitle: 'Evaluación gratuita y acompañamiento en todo el proceso de venta.',
    cta: { label: 'Más información', href: '#contacto' },
  },
];

// Clases estáticas (JIT): tono del overlay configurable desde Ajustes,
// intensidad suave/medio/fuerte → 40/55/70. En hover siempre baja a /20.
const OVERLAYS: Record<string, Record<string, string>> = {
  black: {
    suave: 'bg-black/40 group-hover:bg-black/20',
    medio: 'bg-black/55 group-hover:bg-black/20',
    fuerte: 'bg-black/70 group-hover:bg-black/20',
  },
  navy: {
    suave: 'bg-navy/40 group-hover:bg-navy/20',
    medio: 'bg-navy/55 group-hover:bg-navy/20',
    fuerte: 'bg-navy/70 group-hover:bg-navy/20',
  },
};

export default function Hero({
  slides = defaultSlides,
  autoPlayInterval = 6000,
  overlayTone = 'black',
  overlayIntensity = 'medio',
}: HeroProps) {
  // align:start + altura fija evitan que en móvil la transición se vea "a medias":
  // con min-h el viewport recalculaba su medida a mitad del scroll.
  const [emblaRef, api] = useEmblaCarousel({ loop: true, align: 'start', duration: 20 });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const onSelect = useCallback(() => {
    if (api) setSelected(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || paused || reducedMotion) return;
    // Se reinicia en cada cambio de slide: el autoplay no pisa un arrastre manual.
    // Pausado en hover (lectura tranquila) y desactivado con reduced-motion.
    const timer = setInterval(() => api.scrollNext(), autoPlayInterval);
    return () => clearInterval(timer);
  }, [api, autoPlayInterval, selected, paused, reducedMotion]);

  return (
    <section
      className="group relative h-[580px] sm:h-[600px] lg:h-[620px] overflow-hidden font-display"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="min-w-0 shrink-0 grow-0 basis-full relative h-full" role="group" aria-roledescription="slide">
              <img
                src={slide.image}
                alt=""
                aria-hidden="true"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className={`absolute inset-0 transition-colors duration-500 motion-reduce:transition-none ${OVERLAYS[overlayTone]?.[overlayIntensity] ?? OVERLAYS.black.medio}`}
              />
              <div className="relative z-10 h-full max-w-5xl mx-auto px-4 pb-20 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight mb-8 drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="text-white/85 mb-6 max-w-2xl drop-shadow">{slide.subtitle}</p>
                {slide.cta && (
                  <a
                    href={slide.cta.href}
                    className="inline-block px-8 py-3 rounded-full border-2 border-white text-white font-semibold text-sm sm:text-base hover:bg-white hover:text-navy transition duration-300 shadow-lg"
                  >
                    {slide.cta.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flechas laterales solo en desktop: en móvil pisaban el texto. */}
      <button
        onClick={() => api?.scrollPrev()}
        aria-label="Anterior"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full items-center justify-center text-white transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => api?.scrollNext()}
        aria-label="Siguiente"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full items-center justify-center text-white transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* Controles inferiores: en móvil las flechas van aquí, pequeñas y
          debajo del CTA, flanqueando los dots para no tapar el texto. */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button
          onClick={() => api?.scrollPrev()}
          aria-label="Anterior"
          className="md:hidden w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition"
        >
          <ChevronLeft size={16} />
        </button>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Ir a slide ${index + 1}`}
            className={cn(
              'h-2.5 w-2.5 rounded-full transition-colors',
              index === selected ? 'bg-white' : 'bg-white/60 hover:bg-white/80',
            )}
          />
        ))}
        <button
          onClick={() => api?.scrollNext()}
          aria-label="Siguiente"
          className="md:hidden w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
