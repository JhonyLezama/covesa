import { TrendingUp, Users, Network } from 'lucide-react';

interface StatsProps {
  stats?: {
    value: React.ReactNode;
    valueClass?: string;
    detail: React.ReactNode;
    detailClass?: string;
    icon: React.ReactNode;
  }[];
}

const defaultValueClass = 'text-2xl sm:text-3xl font-extrabold text-gold tracking-tight block';
const defaultDetailClass = 'text-xs text-gray-muted font-medium leading-relaxed';

const defaultStats = [
  {
    value: '+35 AÑOS',
    detail: <><strong className="text-navy">De experiencia</strong> en el sector<br />construcción e inmobiliario.</>,
    icon: <TrendingUp size={40} />,
  },
  {
    value: '+180,000',
    detail: <>Entre <strong className="text-navy">propietarios y clientes</strong><br />en la base de datos</>,
    icon: <Users size={40} />,
  },
  {
    value: <>Infraestructura<br />moderna</>,
    valueClass: 'text-xl sm:text-2xl font-black text-gold leading-tight block',
    detail: 'y software propio',
    detailClass: 'text-xs font-bold text-navy-light',
    icon: <Network size={40} />,
  },
];

export default function Stats({ stats = defaultStats }: StatsProps) {
  return (
    <section className="bg-white border-b border-gray-200 py-10 font-display">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center divide-y md:divide-y-0 md:divide-x divide-gray-100 max-w-sm mx-auto md:max-w-none">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-start md:justify-center gap-4 pt-4 md:pt-0 md:pl-6 first:md:pl-0">
              <div className="w-16 h-16 shrink-0 flex items-center justify-center text-navy">
                {stat.icon}
              </div>
              <div>
                <span className={stat.valueClass ?? defaultValueClass}>
                  {stat.value}
                </span>
                <p className={stat.detailClass ?? defaultDetailClass}>{stat.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
