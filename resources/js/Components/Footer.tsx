import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Leaf, Sun, ChevronRight } from 'lucide-react';

export interface PublicSettings {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  whatsapp?: string | null;
}

interface FooterProps {
  settings?: PublicSettings;
}

const sitemap = [
  { label: 'Proyectos', href: '/#proyectos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Covesa Informa', href: '/#blog' },
  { label: 'Busca tu propiedad', href: '/#proyectos' },
  { label: 'Vende tu propiedad', href: '/#contacto' },
];

const socialBtn =
  'w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-navy hover:text-white transition';

function TikTokIcon() {
  // lucide-react no trae TikTok: SVG inline mínimo (excepción puntual).
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function Footer({ settings }: FooterProps) {
  const phone = settings?.phone ?? '(+51) 964 233 031';
  const email = settings?.email ?? 'informes@cvcovesa.com';
  const address = settings?.address ?? 'Av. Larco 1525 Urb. Fátima';

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-12 text-gray-700 font-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <a href="/" className="flex items-center">
              <span className="bg-navy text-white px-2 py-1 rounded-l font-bold text-lg">CO</span>
              <span className="border-2 border-navy text-navy px-1.5 py-0.5 rounded-r font-extrabold text-lg">VESA</span>
            </a>
            <p className="text-xs text-gray-500 font-medium">
              La manera perfecta de hacer NEGOCIOS INMOBILIARIOS
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a className={socialBtn} href="#" aria-label="Facebook"><Facebook size={14} /></a>
              <a className={socialBtn} href="#" aria-label="Instagram"><Instagram size={14} /></a>
              <a className={socialBtn} href="#" aria-label="TikTok"><TikTokIcon /></a>
              <a className={socialBtn} href="#" aria-label="LinkedIn"><Linkedin size={14} /></a>
            </div>
            <p className="text-[11px] text-gray-400 pt-4">© Copyright 2026 CV Covesa</p>
          </div>

          <nav>
            <h4 className="text-base font-black text-navy mb-4">Mapa de sitio</h4>
            <ul className="space-y-2 text-xs font-medium text-gray-600">
              {sitemap.map((item) => (
                <li key={item.label}>
                  <a className="hover:text-navy-light flex items-center" href={item.href}>
                    <ChevronRight size={9} className="mr-2 text-navy-light" />{item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="text-base font-black text-navy mb-4">Contacto</h4>
            <ul className="space-y-3 text-xs text-gray-600 font-medium">
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-navy shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-navy shrink-0" />
                <span>{email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-navy shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 justify-center md:justify-start">
            <a href="/proyectos/el-milagro" className="bg-el-milagro text-white rounded-xl p-3 flex items-center gap-3 shadow hover:shadow-md transition">
              <Leaf size={24} className="shrink-0 opacity-80" />
              <div>
                <span className="block text-[8px] uppercase tracking-wider opacity-80">Mercado Mayorista Ecológico</span>
                <strong className="text-xs font-black tracking-tight uppercase">El Milagro</strong>
              </div>
            </a>
            <a href="/proyectos/hanan-del-sol" className="bg-gold-dark text-white rounded-xl p-3 flex items-center gap-3 shadow hover:shadow-md transition">
              <Sun size={24} className="shrink-0 opacity-80" />
              <div>
                <strong className="text-xs font-black tracking-tight uppercase">Hanan del Sol</strong>
                <span className="block text-[8px] uppercase tracking-wider opacity-80">Condominio Exclusivo</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
