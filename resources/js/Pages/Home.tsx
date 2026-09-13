import { Head, router, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import PublicLayout from '../Layouts/PublicLayout';
import Hero from '../Components/Hero';
import Stats from '../Components/Stats';
import PropertiesSection from '../Components/PropertiesSection';
import Values from '../Components/Values';
import ClientLogos from '../Components/ClientLogos';
import CTASection from '../Components/CTASection';
import ContactForm from '../Components/ContactForm';
import type { SearchFilters } from '../Components/PropertySearch';
import type { Property } from '../types';

interface HomeProps {
  properties: Property[];
  total: number;
  hasMore: boolean;
  limit: number;
  filterOptions: {
    types: { slug: string; name: string }[];
    zones: { slug: string; name: string }[];
  };
  settings?: Record<string, string | null>;
  flash?: {
    success?: string;
  };
  [key: string]: unknown;
}

export default function Home() {
  const { properties, total, hasMore, limit, filterOptions, settings, flash, errors } = usePage<HomeProps>().props;
  const { url } = usePage();

  const contact = useForm({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSearch = (filters: SearchFilters) => {
    router.get(route('home'), filters, { preserveState: true, preserveScroll: true, replace: true });
  };

  const handleLoadMore = () => {
    // Conserva los filtros actuales de la URL y amplía el límite.
    const params = Object.fromEntries(new URLSearchParams(url.split('?')[1] ?? ''));
    router.get(route('home'), { ...params, limit: limit + 6 }, { preserveState: true, preserveScroll: true });
  };

  return (
    <PublicLayout settings={settings}>
      <Head title="Inicio" />
      <Hero
        overlayTone={settings?.hero_overlay ?? 'black'}
        overlayIntensity={settings?.hero_overlay_intensity ?? 'medio'}
      />
      <Stats />
      <div id="proyectos">
        <PropertiesSection
          properties={properties}
          onSearch={handleSearch}
          filterOptions={filterOptions}
          hasMore={hasMore}
          remaining={total - properties.length}
          onLoadMore={handleLoadMore}
        />
      </div>
      <div id="nosotros">
        <Values />
      </div>
      <ClientLogos />
      <CTASection />

      <section id="contacto" className="bg-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h2 className="text-2xl sm:text-3xl font-medium text-gray-text mb-3">
                Estamos aquí para ayudarte
              </h2>
              <p className="text-sm text-gray-muted leading-relaxed mb-8">
                Ya sea que busques una propiedad, quieras vender tu inmueble o necesites
                asesoría inmobiliaria, nuestro equipo de profesionales está listo para atenderte.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-text">Oficina principal</p>
                    <p className="text-sm text-gray-muted">Av. Javier Prado Este 1234, San Isidro, Lima</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-text">Teléfono</p>
                    <p className="text-sm text-gray-muted">(01) 421-8900 / +51 999 888 777</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-text">Email</p>
                    <p className="text-sm text-gray-muted">info@covesa.com.pe</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-text">Horario de atención</p>
                    <p className="text-sm text-gray-muted">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm
              context="contacto"
              isProcessing={contact.processing}
              errors={errors}
              successMessage={flash?.success}
              onSubmit={(data) => {
                contact.setData(data);
                contact.post(route('contacto.store'), {
                  preserveScroll: true,
                  onSuccess: () => contact.reset('message'),
                });
              }}
            />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
