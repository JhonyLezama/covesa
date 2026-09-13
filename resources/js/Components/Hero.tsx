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

export default function Hero({ slides = defaultSlides, autoPlayInterval = 6000 }: HeroProps) {
  // align:start + altura fija evitan que en móvil la transición se vea "a medias":
  // con min-h el viewport recalculaba su medida a mitad del scroll.
  const [emblaRef, api] = useEmblaCarousel({ loop: true, align: 'start', duration: 20 });
  const [selected, setSelected] = useState(0);

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
    if (!api) return;
    // Se reinicia en cada cambio de slide: el autoplay no pisa un arrastre manual.
    const timer = setInterval(() => api.scrollNext(), autoPlayInterval);
    return () => clearInterval(timer);
  }, [api, autoPlayInterval, selected]);

  return (
    <section className="relative h-[580px] sm:h-[600px] lg:h-[620px] overflow-hidden font-display" aria-roledescription="carousel">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="min-w-0 shrink-0 grow-0 basis-full relative h-full" role="group" aria-roledescription="slide">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-navy/60" />
              <div className="relative z-10 h-full max-w-5xl mx-auto px-4 pb-20 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight mb-8 drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="text-white/85 mb-6 max-w-2xl">{slide.subtitle}</p>
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
