import { TreePine, Flame, ShieldCheck, Factory, Building2, Container, Ship } from 'lucide-react';

interface ClientLogosProps {
  title?: string;
  subtitle?: string;
  clients?: { name: string; tagline?: string; icon: React.ReactNode }[];
}

// Marcas del diseño (los logos reales llegan como assets del cliente).
const defaultClients = [
  { name: 'ASPROMERMET', tagline: 'Mercado Mayorista', icon: <TreePine size={26} className="text-teal-700" /> },
  { name: 'INVERSIONES SAC', tagline: 'Constructora e Inmobiliaria', icon: <Building2 size={26} className="text-navy" /> },
  { name: 'COSTAGAS', tagline: 'Seguro y Rendidor', icon: <Flame size={26} className="text-orange-500" /> },
  { name: 'Gases del Pacífico', icon: <Container size={26} className="text-lime-600" /> },
  { name: 'PROTECTA security', tagline: 'Compañía de Seguros', icon: <ShieldCheck size={26} className="text-orange-600" /> },
  { name: 'BRITÁNICO', icon: <Ship size={26} className="text-navy-dark" /> },
  { name: 'MANNUCCI DIESEL', icon: <Factory size={26} className="text-navy" /> },
];

export default function ClientLogos({
  title = 'Empresas que confiaron en nosotros',
  subtitle = 'La confianza de empresas líderes nos impulsa a seguir construyendo oportunidades.',
  clients = defaultClients,
}: ClientLogosProps) {
  return (
    <section className="py-16 bg-white border-t border-gray-100 font-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight mb-2">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mb-12">{subtitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {clients.map((client) => (
            <div key={client.name} className="flex items-center gap-2">
              {client.icon}
              <div className="text-left leading-none">
                <span className="block text-sm font-extrabold tracking-tight text-navy">{client.name}</span>
                {client.tagline && (
                  <span className="text-[9px] text-gray-400 uppercase">{client.tagline}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
