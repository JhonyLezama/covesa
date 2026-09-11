import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

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
    title: 'Desarrollamos espacios que generan valor',
    subtitle: 'Más de 35 años de experiencia en el mercado inmobiliario peruano, construyendo proyectos que transforman ciudades.',
    cta: { label: 'Conoce nuestros proyectos', href: '#proyectos' },
  },
  {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
    title: 'Proyectos residenciales de primer nivel',
    subtitle: 'Diseño, ubicación y calidad en cada desarrollo. Encuentra el hogar que mereces para ti y tu familia.',
    cta: { label: 'Ver departamentos', href: '#proyectos' },
  },
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    title: 'Espacios corporativos e industriales',
    subtitle: 'Soluciones inmobiliarias para empresas. Oficinas, naves industriales y locales comerciales en las mejores ubicaciones.',
    cta: { label: 'Explorar opciones', href: '#proyectos' },
  },
];

export default function Hero({ slides = defaultSlides, autoPlayInterval = 6000 }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval]);

  return (
    <section className="relative h-[500px] sm:h-[550px] lg:h-[620px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/80 via-navy-dark/50 to-transparent" />
          
          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight mb-4">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8">
                {slide.subtitle}
              </p>
              {slide.cta && (
                <a
                  href={slide.cta.href}
                  className="inline-flex items-center gap-2 bg-gold text-navy-dark px-6 py-3 rounded-lg text-sm font-medium hover:bg-gold-dark transition-colors"
                >
                  {slide.cta.label}
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-gold'
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
