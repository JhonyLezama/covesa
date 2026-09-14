import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import Breadcrumb from '../../Components/Breadcrumb';
import ElMilagroHero from '../../Components/Project/ElMilagroHero';
import ProjectFeatures from '../../Components/Project/ProjectFeatures';
import ProjectLeadForm from '../../Components/Project/ProjectLeadForm';
import AssociatedCarousel from '../../Components/Project/AssociatedCarousel';
import { renderHighlights } from '../../lib/highlights';
import type { Property } from '../../types';

interface PublicProjectProps {
  project: {
    slug: string;
    name: string;
    client_name: string | null;
    client?: { name: string | null; logo_url: string | null };
    service_type: string | null;
    zone?: string;
    status: { name: string; color: string } | null;
    title: string;
    subtitle: string | null;
    description: string | null;
    features: string[];
    hero_image: string | null;
    brochure_url: string | null;
    logo_url: string | null;
    badge: { top: string | null; title: string };
    gallery: string[];
    properties: Property[];
  };
  settings?: Record<string, string | null>;
  flash?: { success?: string };
  errors?: Record<string, string>;
  [key: string]: unknown;
}

export default function Show() {
  const { project, settings, flash, errors } = usePage<PublicProjectProps>().props;

  if (project.slug === 'el-milagro') {
    return (
      <PublicLayout settings={settings}>
        <Head title={project.title} />

        <ElMilagroHero title={project.title} heroImage={project.hero_image} logoUrl={project.logo_url} badge={project.badge} />

        <ProjectFeatures
          description={project.description}
          features={project.features}
          brochureUrl={project.brochure_url}
        />

        <ProjectLeadForm
          projectSlug={project.slug}
          heroImage={project.hero_image}
          successMessage={flash?.success}
          serverErrors={errors}
        />

        <AssociatedCarousel properties={project.properties} />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout settings={settings}>
      <Head title={project.title} />

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb
            items={[{ label: 'Inicio', href: '/' }, { label: 'Servicios', href: '/servicios' }, { label: project.title }]}
          />
        </div>
      </div>

      {/* Hero simple */}
      <section className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <p className="text-sm text-white/70 mb-2">
            {project.zone} {project.client_name ? `· ${project.client_name}` : ''}
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium">{project.title}</h1>
          {project.subtitle && <p className="mt-2 text-white/85">{project.subtitle}</p>}
          {project.status && (
            <span
              className="mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: project.status.color }}
            >
              {project.status.name}
            </span>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {project.gallery.length > 0 && (
          <div className="mb-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {project.gallery.map((url) => (
              <img key={url} src={url} alt={project.title} className="h-56 w-full rounded-xl object-cover" />
            ))}
          </div>
        )}

        {project.description && (
          <p className="max-w-3xl text-gray-text leading-relaxed whitespace-pre-line">{renderHighlights(project.description, 'font-bold uppercase text-navy')}</p>
        )}

        {project.features.length > 0 && (
          <ul className="mt-6 grid max-w-3xl grid-cols-1 sm:grid-cols-2 gap-2">
            {project.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-text">
                <span className="text-gold-dark">›</span> {f}
              </li>
            ))}
          </ul>
        )}

        {project.service_type && (
          <p className="mt-6 text-sm text-gray-muted">Servicio: {project.service_type}</p>
        )}
      </section>
    </PublicLayout>
  );
}
