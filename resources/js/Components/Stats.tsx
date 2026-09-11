interface StatsProps {
  stats?: { value: string; label: string }[];
}

const defaultStats = [
  { value: '35+', label: 'Años de experiencia' },
  { value: '150+', label: 'Proyectos entregados' },
  { value: '200+', label: 'Clientes corporativos' },
  { value: '500K+', label: 'm² construidos' },
];

export default function Stats({ stats = defaultStats }: StatsProps) {
  return (
    <section className="bg-navy py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-medium text-gold mb-1">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
