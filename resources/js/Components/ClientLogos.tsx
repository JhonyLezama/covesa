import { Building2, Briefcase, Landmark, Store, Factory, Activity } from 'lucide-react';

interface ClientLogosProps {
  title?: string;
  subtitle?: string;
  clients?: { name: string; icon: React.ReactNode }[];
}

const defaultClients = [
  { name: 'Banco de Crédito', icon: <Landmark size={28} /> },
  { name: 'Scotiabank', icon: <Briefcase size={28} /> },
  { name: 'Real State Corp', icon: <Building2 size={28} /> },
  { name: 'Mall Plaza', icon: <Store size={28} /> },
  { name: 'Aceros Arequipa', icon: <Factory size={28} /> },
  { name: 'Clínica San Pablo', icon: <Activity size={28} /> },
];

export default function ClientLogos({
  title = 'Empresas que confiaron en nosotros',
  subtitle = 'Más de 200 empresas han confiado en COVESA para sus proyectos inmobiliarios',
  clients = defaultClients,
}: ClientLogosProps) {
  return (
    <section className="bg-gray-bg py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-text mb-2">{title}</h2>
          <p className="text-sm text-gray-muted max-w-lg mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {clients.map((client, index) => (
            <div
              key={index}
              className="group flex flex-col items-center justify-center bg-white rounded-lg p-5 sm:p-6 shadow-sm border border-gray-100 hover:border-navy/20 transition-all cursor-pointer"
            >
              <div className="text-gray-300 group-hover:text-navy transition-colors mb-2">
                {client.icon}
              </div>
              <span className="text-xs text-gray-muted group-hover:text-gray-text text-center transition-colors">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
