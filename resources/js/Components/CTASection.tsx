import { Phone, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export default function CTASection({
  title = '¿Tienes una propiedad para vender?',
  subtitle = 'Nuestro equipo de expertos te ayudará a obtener el mejor valor por tu inmueble. Evaluación gratuita y sin compromiso.',
  primaryCta = { label: 'Vende con nosotros', href: '#contacto' },
  secondaryCta = { label: 'Llámanos ahora', href: 'tel:+5114218900' },
}: CTASectionProps) {
  return (
    <section className="bg-gray-bg py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-xl p-8 sm:p-10 lg:p-12 text-center relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-medium text-white mb-3">{title}</h2>
            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-8">{subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={primaryCta.href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold text-navy-dark px-6 py-3 rounded-lg text-sm font-medium hover:bg-gold-dark transition-colors"
              >
                {primaryCta.label}
                <ArrowRight size={16} />
              </a>
              <a
                href={secondaryCta.href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                <Phone size={16} />
                {secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
