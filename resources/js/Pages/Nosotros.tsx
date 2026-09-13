import { Head, usePage } from '@inertiajs/react';
import { HeartHandshake, Clock, BadgeCheck, Timer, Award, Target, Flag } from 'lucide-react';
import { useState } from 'react';
import PublicLayout from '../Layouts/PublicLayout';

interface NosotrosProps {
  settings?: Record<string, string | null>;
  [key: string]: unknown;
}

const values = [
  {
    icon: <HeartHandshake size={32} />,
    title: 'Compromiso',
    lines: [
      'Brindarles un servicio de mejor calidad, como con nuestros colaboradores,',
      'promoviendo su crecimiento tanto personal como profesional.',
    ],
  },
  {
    icon: (
      <span className="relative inline-flex">
        <Clock size={32} />
        <BadgeCheck size={14} className="absolute -bottom-1 -right-2 bg-white rounded-full text-gold" />
      </span>
    ),
    title: 'Proactividad',
    lines: [
      'Nos anticipamos a las necesidades del mercado y de cada cliente,',
      'actuando con agilidad antes de que las oportunidades pasen.',
    ],
  },
  {
    icon: <Timer size={32} />,
    title: 'Flexibilidad',
    lines: [
      'Adaptamos cada solución a los objetivos y tiempos de nuestros clientes,',
      'sin rigideces ni fórmulas únicas.',
    ],
  },
  {
    icon: <Award size={32} />,
    title: 'Excelencia',
    lines: [
      'Buscamos el más alto estándar en cada entrega,',
      'cuidando cada detalle del proceso inmobiliario.',
    ],
  },
];

const alliances = [
  {
    logo: (
      <div className="text-center font-black">
        <span className="block text-3xl tracking-tight text-red-600">D&apos;Luchos</span>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Pollerías</span>
      </div>
    ),
    title: "D' LUCHOS",
    text: (
      <>
        D&apos;Luchos confió en nuestro proyecto para{' '}
        <strong className="font-bold text-gray-900">
          abrir un nuevo punto de venta dentro del Mercado Mayorista Ecológico El Milagro
        </strong>
        , generando una sinergia comercial que conecta marcas, oportunidades y nuevos espacios de crecimiento.
      </>
    ),
  },
  {
    logo: (
      <div className="w-32 rounded-lg border-2 border-blue-800 bg-slate-50 p-3 text-center shadow-sm">
        <div className="rounded-sm bg-blue-800 py-0.5 text-[10px] font-bold text-white">C.A. MANNUCCI</div>
        <div className="text-[9px] font-bold text-red-600">TRUJILLO</div>
      </div>
    ),
    title: 'CARLOS A. MANNUCCI',
    text: (
      <>
        Somos <strong className="font-bold text-gray-900">sponsor oficial de Carlos A. Mannucci</strong>, una
        alianza que nos permite acercar beneficios y experiencias exclusivas a nuestros socios, mientras respaldamos
        a una institución con historia, pasión y una gran hinchada.
      </>
    ),
  },
  {
    logo: (
      <div className="flex flex-col items-center">
        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-700">
          Cámara de Comercio
        </span>
        <span className="block text-[8px] font-bold uppercase text-slate-500">De La Libertad</span>
        <span className="mt-1 text-base font-black text-navy">CCL</span>
      </div>
    ),
    title: 'CÁMARA DE COMERCIO',
    text: (
      <>
        Mantenemos una{' '}
        <strong className="font-bold text-gray-900">relación activa con distintas Cámaras de Comercio</strong>, que
        nos permiten participar en eventos empresariales, ampliar nuestra red de contactos, fortalecer vínculos
        institucionales y acercarnos a nuevas oportunidades de negocio.
      </>
    ),
  },
];

export default function Nosotros() {
  const { settings } = usePage<NosotrosProps>().props;
  // Tap en móvil (sin hover): qué card está volteada. En desktop manda el hover.
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <PublicLayout settings={settings}>
      <Head title="Nosotros" />

      {/* ¿Quiénes somos? */}
      <section className="relative overflow-hidden pt-12 pb-20">
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 lg:pr-12 xl:pr-16">
              <h2 className="text-3xl lg:text-4xl font-black text-gold tracking-wide uppercase">
                ¿Quiénes somos?
              </h2>
              <div>
                <p className="text-navy-light font-semibold text-lg leading-tight">Lo que nos hace únicos</p>
                <h1 className="mt-1 text-3xl lg:text-4xl font-extrabold text-navy tracking-tight leading-none">
                  ES LA DIFERENCIA
                </h1>
              </div>
              <div className="text-gray-700 text-sm leading-relaxed space-y-4 pt-2">
                <p>
                  <strong className="text-navy">CV COVESA</strong> somos una empresa con más de 35 años de
                  experiencia en el sector inmobiliario, desarrollando soluciones orientadas a generar valor para{' '}
                  <strong className="text-gray-900">empresas, inversionistas y propietarios</strong>.
                </p>
                <p>
                  Nuestra experiencia nos permite brindar un servicio integral y de calidad, acompañando cada
                  proyecto desde la identificación de oportunidades y la planificación hasta la gestión y desarrollo
                  inmobiliario.
                </p>
                <p>
                  Contamos con un equipo especializado y una visión estratégica del mercado que nos permite ofrecer
                  soluciones, adaptándonos a las necesidades y objetivos de cada cliente.
                </p>
              </div>
            </div>
            <div className="relative flex items-center">
              {/* Móvil: banda azul a todo el ancho + foto equipo 80%
                  a caballo del borde inferior. */}
              <div className="w-full lg:hidden">
                <div className="relative -mx-4 h-56 overflow-hidden bg-navy">
                  <img
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-40"
                    loading="lazy"
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                  />
                </div>
                <div className="relative z-10 mx-auto -mt-32 w-[80%] overflow-hidden rounded-tr-[2rem] rounded-bl-[2rem] border-4 border-white shadow-2xl">
                  <img
                    alt="Equipo de profesionales y arquitectos Covesa"
                    className="h-64 w-full object-cover"
                    loading="eager"
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"
                  />
                  <div className="absolute bottom-3 right-3 bg-navy/90 px-2 py-0.5 rounded text-white text-[10px] font-bold tracking-widest uppercase">
                    Covesa equipo
                  </div>
                </div>
              </div>
              {/* Capa fondo: centrada en la foto frontal, sale hasta el borde
                  del viewport (la sección recorta el sobrante). Foto +
                  overlay azul, radio arriba-izquierda en rem. */}
              <div className="absolute left-[15%] -right-[50vw] top-1/2 hidden lg:block h-[26rem] -translate-y-1/2 overflow-hidden rounded-tl-[5rem] bg-navy">
                <img
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                  loading="lazy"
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
                />
              </div>
              {/* Capa frente: foto equipo, rectangular con radios
                  superior-derecho e inferior-izquierdo de 2.5rem. */}
              <div className="relative z-10 hidden w-full lg:block lg:w-11/12 rounded-tr-[2.5rem] rounded-bl-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img
                  alt="Equipo de profesionales y arquitectos Covesa"
                  className="w-full h-64 lg:h-80 object-cover"
                  loading="eager"
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80"
                />
                <div className="absolute bottom-4 right-4 bg-navy/90 px-3 py-1 rounded text-white text-xs font-bold tracking-widest uppercase flex items-center space-x-1">
                  <span className="text-gold font-black">●</span>
                  <span>Covesa equipo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-navy tracking-tight">Nuestros Valores</h2>
          <p className="mt-3 text-gray-muted max-w-2xl mx-auto text-base">
            Principios que definen nuestra forma de trabajar y nos impulsan
            <br className="hidden sm:inline" />
            a brindar soluciones con compromiso, agilidad y excelencia.
          </p>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, index) => (
              <div key={v.title}>
                {/* Móvil/tablet: contenido completo sin flip */}
                <article className="rounded-3xl border border-gray-200 bg-gray-bg p-8 flex flex-col items-center text-center min-h-[360px] justify-center lg:hidden">
                  <div className="w-24 h-24 rounded-full border-2 border-gold flex items-center justify-center p-2 mb-4">
                    <div className="w-20 h-20 rounded-full border-2 border-navy-light flex items-center justify-center text-navy-light">
                      {v.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-navy">{v.title}</h3>
                  <span aria-hidden="true" className="my-3 block h-0.5 w-8 bg-gold" />
                  {v.lines.map((line, i) => (
                    <p key={i} className="text-xs text-gray-600 leading-relaxed">{line}</p>
                  ))}
                </article>
                {/* Desktop: flip hover */}
                <article
                  tabIndex={0}
                  role="button"
                  aria-label={`${v.title}: activar para ver descripción`}
                  onClick={() => setFlipped(flipped === index ? null : index)}
                  onMouseLeave={() => setFlipped(null)}
                  onFocus={() => setFlipped(index)}
                  onBlur={() => setFlipped(null)}
                  className={`group hidden lg:block min-h-[360px] cursor-pointer [perspective:1200px] focus:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded-3xl ${flipped === index ? 'flip-on' : ''}`}
                >
                <div
                  className={`relative h-full min-h-[360px] transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none group-hover:[transform:rotateY(180deg)] ${flipped === index ? '[transform:rotateY(180deg)]' : ''}`}
                >
                  {/* Frente: solo logo + título */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 [backface-visibility:hidden]">
                    <div className="w-24 h-24 rounded-full border-2 border-gold flex items-center justify-center p-2 mb-6">
                      <div className="w-20 h-20 rounded-full border-2 border-navy-light flex items-center justify-center text-navy-light">
                        {v.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold text-navy">{v.title}</h3>
                  </div>
                  {/* Reverso: línea + párrafo escalonado */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-navy p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <span aria-hidden="true" className="flip-line mb-3 block h-0.5 w-8 bg-gold" style={{ animationDelay: '40ms' }} />
                    <h3 className="flip-line text-lg font-extrabold text-gold" style={{ animationDelay: '80ms' }}>
                      {v.title}
                    </h3>
                    <span aria-hidden="true" className="flip-divider my-3 block h-0.5 w-12 origin-left bg-gold" style={{ animationDelay: '180ms' }} />
                    {v.lines.map((line, i) => (
                      <p
                        key={i}
                        className="flip-line text-xs text-white/90 leading-relaxed"
                        style={{ animationDelay: `${280 + i * 120}ms` }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="relative py-20 bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            alt="Oficina colaboradores trabajando"
            className="w-full h-full object-cover"
            loading="lazy"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-white/50 -translate-x-1/2" />
            <div className="flex flex-col items-center text-center space-y-4 px-4">
              <Target size={48} strokeWidth={1.5} />
              <h2 className="text-3xl lg:text-4xl font-black tracking-wide">Misión</h2>
              <p className="text-base lg:text-lg font-light leading-relaxed max-w-lg">
                Ser un grupo empresarial líder en el Perú con presencia internacional,{' '}
                <strong className="font-bold text-gold">
                  reconocidos por el grado de profesionalismo y la calidad de nuestros servicios.
                </strong>
              </p>
            </div>
            {/* Separador tenue solo en móvil, donde los bloques se apilan */}
            <div aria-hidden="true" className="md:hidden h-0.5 w-full bg-white/60" />
            <div className="flex flex-col items-center text-center space-y-4 px-4">
              <Flag size={48} strokeWidth={1.5} />
              <h2 className="text-3xl lg:text-4xl font-black tracking-wide">Visión</h2>
              <p className="text-base lg:text-lg font-light leading-relaxed max-w-lg">
                <strong className="font-bold text-gold">Brindar una consultoría integral</strong> de los servicios
                que ofrecemos para <strong className="font-bold text-gold">satisfacer las necesidades
                inmobiliarias</strong> y/o de construcción de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alianzas Estratégicas */}
      <section className="py-20 bg-gray-bg">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-navy tracking-tight mb-12">
            Alianzas Estratégicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {alliances.map((a) => (
              <article
                key={a.title}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col justify-between"
              >
                <div className="h-36 flex items-center justify-center p-2 mb-6">{a.logo}</div>
                <div>
                  <h3 className="text-lg font-black text-navy mb-3">{a.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{a.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
