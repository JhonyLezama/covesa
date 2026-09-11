import { Shield, Lightbulb, Users, TrendingUp } from 'lucide-react';

interface ValueCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ValuesProps {
  title?: string;
  subtitle?: string;
  values?: ValueCard[];
}

const defaultValues: ValueCard[] = [
  {
    icon: <Shield size={28} />,
    title: 'Confianza',
    description: 'Más de 35 años de trayectoria nos respaldan. Cada proyecto cumple con los más altos estándares de calidad y seguridad.',
  },
  {
    icon: <Lightbulb size={28} />,
    title: 'Innovación',
    description: 'Aplicamos las últimas tendencias en diseño, construcción y tecnología para crear espacios que anticipan el futuro.',
  },
  {
    icon: <Users size={28} />,
    title: 'Compromiso',
    description: 'Trabajamos de la mano con cada cliente, entendiendo sus necesidades y superando sus expectativas en cada entrega.',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Valor',
    description: 'Generamos plusvalía real y sostenible. Nuestros proyectos son inversiones inteligentes que crecen con el tiempo.',
  },
];

export default function Values({
  title = 'Nuestros Valores',
  subtitle = 'Los principios que guían cada decisión y cada proyecto que desarrollamos',
  values = defaultValues,
}: ValuesProps) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-text mb-2">{title}</h2>
          <p className="text-sm text-gray-muted max-w-lg mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-gray-bg rounded-lg p-6 text-center hover:shadow-sm transition-shadow border border-transparent hover:border-gray-100"
            >
              <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-navy">
                {value.icon}
              </div>
              <h3 className="text-base font-medium text-gray-text mb-2">{value.title}</h3>
              <p className="text-sm text-gray-muted leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
