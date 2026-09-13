import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ChevronDown, MapPin } from 'lucide-react';
import { useState } from 'react';
import PublicLayout from '../Layouts/PublicLayout';
import Breadcrumb from '../Components/Breadcrumb';
import { renderHighlights } from '../lib/highlights';
import { cn } from '../lib/utils';

interface ServiceProject {
  name: string;
  slug: string;
  client_name: string | null;
  client: { name: string; logo_url: string | null; show_name: boolean } | null;
  service_type: string | null;
  zone?: string;
  status: { slug: string; name: string; color: string } | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover: string;
  href: string;
}

interface ServiciosProps {
  projects: ServiceProject[];
  total: number;
  hasMore: boolean;
  limit: number;
  settings?: Record<string, string | null>;
  [key: string]: unknown;
}

const services = [
  {
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80',
    title: 'Consultoría Inmobiliaria',
    description:
      'Brindamos el servicio de asesoría inmobiliaria corporativa con profesionales que llevan más de 30 años de experiencia y un amplio conocimiento del mercado inmobiliario.',
    bullets: [
      'Intermediación inmobiliaria corporativa',
      'Intermediación inmobiliaria residencial',
      'Valorizaciones',
      'Estudios de mercado inmobiliario',
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    title: 'Gestión de Activos',
    description:
      'Administramos y potenciamos tus activos inmobiliarios para maximizar su rentabilidad con gestión profesional y transparente.',
    bullets: ['Administración de inmuebles', 'Saneamiento y regularización', 'Optimización de rentabilidad'],
  },
  {
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
    title: 'Project Management',
    description:
      'Gerenciamos tu proyecto de principio a fin: planificación, ejecución y control con estándares de calidad y cumplimiento de plazos.',
    bullets: ['Planificación y presupuestos', 'Supervisión de obra', 'Control de plazos y calidad'],
  },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function ProjectCard({ project, big = false }: { project: ServiceProject; big?: boolean }) {
  const clientName = project.client?.name ?? project.client_name ?? project.name;
  const logoUrl = project.client?.logo_url ?? null;
  // Nombre solo si el cliente lo permite (toggle show_name del directorio).
  // En obra (show_name=false) va solo el logo/monograma, como la referencia.
  const showName = project.client?.show_name ?? true;
  return (
    <Link
      href={project.href}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-slate-900 shadow-lg',
        big ? 'min-h-[460px]' : 'min-h-[440px]',
      )}
    >
      <img
        alt={project.title}
        src={project.cover}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-80 transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

      <div className="relative z-10 px-6 pt-16 sm:px-8 lg:pt-14">
        {project.status && (
          <span
            className={`absolute top-6 lg:top-10 right-0 rounded-none px-3 py-1 font-extrabold uppercase text-white shadow ${big ? 'text-sm' : 'text-[11px]'}`}
            style={{ backgroundColor: project.status.color }}
          >
            {project.status.name}
          </span>
        )}
        <div className="flex flex-col items-center px-8 text-center sm:px-16">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={clientName}
              loading="lazy"
              className="h-auto max-h-16 w-auto max-w-[220px] rounded-lg bg-white/95 object-contain px-3 py-1.5 shadow"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-white/80 bg-white/10 font-black text-xl text-white backdrop-blur-sm">
              {initials(clientName)}
            </div>
          )}
        </div>
      </div>

      {/* Cinta inferior: etiqueta cliente + ubicación + servicio + detalle */}
      <div className="relative z-10 bg-black/50 px-6 py-4 sm:px-8">
        {showName && (
          <span className="absolute -top-[18px] left-6 sm:left-8 z-10 inline-block rounded-tl-lg rounded-br-lg bg-navy px-3 py-1 text-lg font-extrabold uppercase text-white shadow-lg">
            {clientName}
          </span>
        )}
        {(project.subtitle || project.zone) && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-200">
            <MapPin size={14} className="shrink-0 text-gold" />
            {project.subtitle ?? project.zone}
          </p>
        )}
        {project.service_type && (
          <p className="mt-1 text-sm font-black uppercase tracking-wider text-gold">
            {project.service_type}
          </p>
        )}
        {project.description && (
          <p className="mt-1 line-clamp-3 text-[11px] font-light leading-relaxed text-gray-300">
            {renderHighlights(project.description)}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function Servicios() {
  const { projects, total, hasMore, limit, settings } = usePage<ServiciosProps>().props;
  const [open, setOpen] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  // Arriba: hasta 2 activos (construcción/proceso). Abajo: resto de activos
  // en orden + concluidos. División por estado, no por posición.
  const [featured, rest] = splitByStatus(projects);
  // Si se colapsa todo (open=-1), la imagen conserva la última visible.
  const current = open >= 0 ? services[open] : services[0];

  const handleLoadMore = () => {
    setLoadingMore(true);
    router.get(
      route('servicios'),
      { limit: limit + 6 },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setLoadingMore(false),
      },
    );
  };

  return (
    <PublicLayout settings={settings}>
      <Head title="Servicios" />

      {/* Hero de sección */}
      <section className="relative flex min-h-[340px] items-center overflow-hidden bg-navy text-white lg:min-h-[400px]">
        <div className="absolute inset-0 z-0">
          <img
            alt="Reunión técnica corporativa COVESA"
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80"
            className="h-full w-full object-cover object-right opacity-40 md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy/90 to-transparent" />
        </div>
        {/* Breadcrumb por encima del fondo, sin romperlo */}
        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Servicios' }]} />
          </div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-none tracking-tight text-white drop-shadow-sm">
              Nuestros
              <br />
              Servicios
            </h1>
            <div className="mt-6">
              <a
                href="#servicios-detalle"
                className="inline-block rounded-full bg-gold px-8 py-3 text-sm sm:text-base font-bold text-navy-dark shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-gold-dark"
              >
                Más información
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Acordeón + imagen */}
      <section id="servicios-detalle" className="relative bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border-4 border-white bg-gray-100 shadow-2xl">
                <img
                  key={current.title}
                  alt={current.title}
                  src={current.image}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center space-x-2">
                  {services.map((s, i) => (
                    <button
                      key={s.title}
                      aria-label={`Ver ${s.title}`}
                      onClick={() => setOpen(i)}
                      className={cn(
                        'h-3 w-3 rounded-full shadow transition',
                        i === open ? 'bg-white' : 'bg-white/60 hover:bg-white',
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              {services.map((s, i) => {
                const isOpen = open === i;
                return (
                  <div key={s.title} className={cn('border-b border-gray-200', isOpen ? 'pb-6' : 'py-3')}>
                    <button
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl sm:text-3xl font-bold text-navy">
                          {String(i + 1).padStart(2, '0')}.
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-navy transition group-hover:text-navy-light">
                          {s.title}
                        </h3>
                      </div>
                      <ChevronDown
                        size={20}
                        className={cn('shrink-0 text-navy transition-transform duration-300', isOpen && 'rotate-180')}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-4 pl-10 sm:pl-12">
                        <p className="text-sm sm:text-base font-normal leading-relaxed text-gray-700">
                          {s.description}
                        </p>
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                          {s.bullets.map((b) => (
                            <div key={b} className="flex items-start space-x-2">
                              <span className="mt-1 text-sm text-navy">•</span>
                              <span className="text-xs sm:text-sm font-semibold text-gray-800">{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Propuesta de valor */}
      <section className="bg-white pt-8 pb-14 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
            Soluciones que generan valor
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-gray-600">
            Brindamos servicios inmobiliarios y de gestión adaptados a las necesidades de cada empresa, para generar
            resultados que impulsen su crecimiento
          </p>
        </div>
      </section>

      {/* Grid de proyectos reales */}
      <section className="bg-white pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="rounded-2xl bg-gray-bg p-10 text-center">
              <p className="text-lg font-bold text-navy">Pronto publicaremos nuestros proyectos</p>
              <p className="mt-1 text-sm text-gray-muted">Estamos preparando las fichas de cada solución.</p>
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {featured.map((p) => (
                    <ProjectCard key={p.slug} project={p} big />
                  ))}
                </div>
              )}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                </div>
              )}
              {/* Solo aparece si hay más por cargar. */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center justify-center px-8 py-2 rounded-full border border-navy text-sm font-semibold text-navy hover:bg-navy hover:text-white transition shadow-sm disabled:opacity-60"
                  >
                    {loadingMore ? 'Cargando…' : total - projects.length > 0 ? `Ver más (${total - projects.length})` : 'Ver más'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

function splitByStatus(arr: ServiceProject[]): [ServiceProject[], ServiceProject[]] {
  const active = arr.filter((p) => p.status?.slug === 'en-construccion' || p.status?.slug === 'en-proceso');
  const done = arr.filter((p) => !active.includes(p));
  return [active.slice(0, 2), [...active.slice(2), ...done]];
}
