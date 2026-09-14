import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { MapPin, CheckCircle, ExternalLink } from 'lucide-react';

interface ProjectLeadFormProps {
  projectSlug: string;
  successMessage?: string;
  serverErrors?: Record<string, string>;
}

// Mercado Mayorista Ecológico El Milagro (híbrido: satélite + calles y nombres).
const MAP_SRC =
  'https://maps.google.com/maps?q=Mercado%20Mayorista%20Ecol%C3%B3gico%20El%20Milagro%2C%20Trujillo%2C%20Per%C3%BA&t=h&z=17&ie=UTF8&iwloc=&output=embed';

// Google Maps completo en pestaña nueva (allí sí hay vista 3D con un clic).
const MAP_3D_URL =
  'https://www.google.com/maps/search/?api=1&query=Mercado%20Mayorista%20Ecol%C3%B3gico%20El%20Milagro%20Trujillo%20Per%C3%BA&basemap=satellite';

const PUESTO_OPTIONS = [
  'Puesto Zona Minorista',
  'Puesto Zona Mayorista',
  'Módulo Zona Financiera',
  'Local Zona Comercial 1',
  'Local Zona Comercial 2',
];

const DOC_OPTIONS = ['DNI', 'RUC', 'CE', 'PAS'];

const inputClass =
  'w-full rounded-lg border-slate-300 py-3 px-4 text-slate-800 placeholder-slate-400 focus:ring-[#2F8F4E] focus:border-[#2F8F4E] shadow-sm text-sm border';

export default function ProjectLeadForm({ projectSlug, successMessage, serverErrors }: ProjectLeadFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    tipo_puesto: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    document_type: '',
    document_number: '',
    rubro: '',
    accepted_data_policy: false as boolean,
    accepted_marketing_policy: false as boolean,
  });

  const mergedErrors: Record<string, string> = { ...(errors as Record<string, string>), ...(serverErrors ?? {}) };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('proyectos.leads.store', { slug: projectSlug }), {
      preserveScroll: true,
      onSuccess: () => reset('rubro'),
    });
  };

  if (successMessage) {
    return (
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#2F8F4E] uppercase">{successMessage}</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-14 lg:py-20 bg-white overflow-x-clip">
      <img
        src="/images/el-milagro/ingeniero.png"
        alt="Ingeniero El Milagro"
        aria-hidden="true"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
        className="pointer-events-none absolute left-0 top-[170px] z-10 hidden h-80 select-none md:block lg:top-[200px] lg:h-[400px] xl:h-[440px]"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-md lg:max-w-lg mt-8">
              <div className="absolute -top-8 -left-8 z-10 w-16 h-16 bg-[#2F8F4E] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-emerald-100">
                <MapPin size={32} />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <iframe
                  title="Ubicación del proyecto en Google Maps"
                  src={MAP_SRC}
                  className="w-full h-[420px] border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-4 text-center">
                <a
                  href={MAP_3D_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-navy px-6 py-2 text-xs font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
                >
                  <ExternalLink size={14} />
                  Ver en 3D
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight">
                <span className="text-[#2F8F4E]">Adquiere tu puesto en el</span>{' '}
                <span className="text-[#e67319]">mercado aquí</span>
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Déjanos tus datos y uno de nuestros asesores se comunicará contigo a la brevedad.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="sr-only" htmlFor="tipo_puesto">Tipo de puesto</label>
                <select
                  id="tipo_puesto"
                  value={data.tipo_puesto}
                  onChange={(e) => setData('tipo_puesto', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Tipo de puesto</option>
                  {PUESTO_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {mergedErrors.tipo_puesto && <p className="mt-1 text-xs text-red-500">{mergedErrors.tipo_puesto}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} placeholder="Nombres" className={inputClass} />
                  {mergedErrors.first_name && <p className="mt-1 text-xs text-red-500">{mergedErrors.first_name}</p>}
                </div>
                <div>
                  <input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} placeholder="Apellidos" className={inputClass} />
                  {mergedErrors.last_name && <p className="mt-1 text-xs text-red-500">{mergedErrors.last_name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Correo" className={inputClass} />
                  {mergedErrors.email && <p className="mt-1 text-xs text-red-500">{mergedErrors.email}</p>}
                </div>
                <div>
                  <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="Teléfono" className={inputClass} />
                  {mergedErrors.phone && <p className="mt-1 text-xs text-red-500">{mergedErrors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <select value={data.document_type} onChange={(e) => setData('document_type', e.target.value)} className={inputClass}>
                    <option value="">Tipo de documento</option>
                    {DOC_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  {mergedErrors.document_type && <p className="mt-1 text-xs text-red-500">{mergedErrors.document_type}</p>}
                </div>
                <div>
                  <input value={data.document_number} onChange={(e) => setData('document_number', e.target.value)} placeholder="N° de documento" className={inputClass} />
                  {mergedErrors.document_number && <p className="mt-1 text-xs text-red-500">{mergedErrors.document_number}</p>}
                </div>
              </div>

              <div>
                <textarea
                  value={data.rubro}
                  onChange={(e) => setData('rubro', e.target.value)}
                  placeholder="¿A qué rubro te dedicas?"
                  rows={3}
                  className={inputClass}
                />
                {mergedErrors.rubro && <p className="mt-1 text-xs text-red-500">{mergedErrors.rubro}</p>}
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-600">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.accepted_data_policy}
                    onChange={(e) => setData('accepted_data_policy', e.target.checked)}
                    className="rounded border-slate-300 text-[#F2A623] focus:ring-[#F2A623]"
                  />
                  <span>He leído y acepto los términos y condiciones de CV Covesa.</span>
                </label>
                {mergedErrors.accepted_data_policy && <p className="text-xs text-red-500">{mergedErrors.accepted_data_policy}</p>}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.accepted_marketing_policy}
                    onChange={(e) => setData('accepted_marketing_policy', e.target.checked)}
                    className="rounded border-slate-300 text-[#F2A623] focus:ring-[#F2A623]"
                  />
                  <span>Autorizo el tratamiento de mis datos personales para fines comerciales y publicitarios.</span>
                </label>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-48 bg-[#F2A623] hover:bg-[#d98f1a] text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 disabled:opacity-60"
                >
                  {processing ? 'Enviando…' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
