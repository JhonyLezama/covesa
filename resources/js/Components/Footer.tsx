import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const footerSections = [
  {
    title: 'Empresa',
    links: [
      { label: 'Nosotros', href: '#nosotros' },
      { label: 'Nuestro equipo', href: '#equipo' },
      { label: 'Trayectoria', href: '#trayectoria' },
      { label: 'Trabaja con nosotros', href: '#careers' },
    ],
  },
  {
    title: 'Servicios',
    links: [
      { label: 'Desarrollo inmobiliario', href: '#servicios' },
      { label: 'Construcción', href: '#servicios' },
      { label: 'Consultoría', href: '#servicios' },
      { label: 'Administración de propiedades', href: '#servicios' },
    ],
  },
  {
    title: 'Proyectos',
    links: [
      { label: 'Residencial', href: '#proyectos' },
      { label: 'Comercial', href: '#proyectos' },
      { label: 'Industrial', href: '#proyectos' },
      { label: 'Terrenos', href: '#proyectos' },
    ],
  },
];

export default function Footer({
  companyName = 'COVESA',
  address = 'Av. Javier Prado Este 1234, San Isidro, Lima, Perú',
  phone = '(01) 421-8900',
  email = 'info@covesa.com.pe',
}: FooterProps) {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-navy-dark font-medium text-lg">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-medium tracking-tight leading-none">{companyName}</span>
                <span className="text-[10px] opacity-70 tracking-widest uppercase">Inmobiliaria</span>
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed mb-6 max-w-sm">
              Más de 35 años construyendo confianza en el mercado inmobiliario peruano. 
              Desarrollamos proyectos que transforman espacios y generan valor sostenible.
            </p>
            <div className="space-y-2 text-sm opacity-70">
              <a href="#" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <MapPin size={14} /> {address}
              </a>
              <a href={`tel:${phone}`} className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Phone size={14} /> {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Mail size={14} /> {email}
              </a>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy-dark transition-colors">
                <Facebook size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy-dark transition-colors">
                <Instagram size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy-dark transition-colors">
                <Linkedin size={15} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-medium mb-4 text-gold">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-60">
            <p>© {new Date().getFullYear()} {companyName}. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:opacity-100 transition-opacity">Política de privacidad</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Términos y condiciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
