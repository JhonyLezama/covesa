import { useState } from 'react';
import { Menu, X, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  navItems?: { label: string; href: string }[];
}

const defaultNavItems = [
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Proyectos', href: '/#proyectos' },
  { label: 'CV Blog', href: '/#blog' },
];

const ctaButtons = [
  { label: 'Busca tu propiedad', href: '/#proyectos', solid: false },
  { label: 'Vende con nosotros', href: '/#contacto', solid: false },
  { label: 'Refiere y gana', href: '/#refiere', solid: true },
];

function Flag({ code }: { code: 'pe' | 'gb' | 'fr' }) {
  if (code === 'pe') {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-[2px] shrink-0" aria-hidden="true">
        <rect width="16" height="12" fill="#D91023" />
        <rect x="5.33" width="5.34" height="12" fill="#fff" />
      </svg>
    );
  }
  if (code === 'fr') {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-[2px] shrink-0" aria-hidden="true">
        <rect width="5.33" height="12" fill="#0055A4" />
        <rect x="5.33" width="5.34" height="12" fill="#fff" />
        <rect x="10.67" width="5.33" height="12" fill="#EF4135" />
      </svg>
    );
  }
  return (
    <svg width="16" height="12" viewBox="0 0 30 20" className="rounded-[2px] shrink-0" aria-hidden="true">
      <rect width="30" height="20" fill="#012169" />
      <path d="M0,0 30,20 M30,0 0,20" stroke="#fff" strokeWidth="4" />
      <path d="M0,0 30,20 M30,0 0,20" stroke="#C8102E" strokeWidth="2" />
      <path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="6" />
      <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.5" />
    </svg>
  );
}

const languages = [
  { code: 'pe' as const, label: 'ES', name: 'Español', active: true },
  { code: 'gb' as const, label: 'EN', name: 'English', active: false },
  { code: 'fr' as const, label: 'FR', name: 'Français', active: false },
];

export default function Header({ navItems = defaultNavItems }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm font-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid 1fr-auto-1fr: laterales elásticos iguales = centro real + balance */}
        <div className="flex items-center justify-between h-20 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          {/* Logo: izq en mobile, centro real en desktop */}
          <a href="/" className="flex items-center lg:col-start-2 lg:justify-self-center" aria-label="COVESA inicio">
            <span className="bg-navy text-white px-2 py-1 rounded-l-md font-bold text-xl tracking-wider">CO</span>
            <span className="border-2 border-navy text-navy px-1.5 py-0.5 rounded-r-md font-extrabold text-xl tracking-wider">VESA</span>
          </a>

          {/* Nav izquierda: ocupa toda su columna y reparte */}
          <nav className="hidden lg:flex items-center justify-between w-full lg:col-start-1 lg:row-start-1 lg:justify-self-stretch lg:pr-6" aria-label="Principal">
            {navItems.map((item, i) => (
              <span key={item.label} className="flex items-center gap-4 xl:gap-5 whitespace-nowrap">
                {i > 0 && <span className="text-navy/20">|</span>}
                <a
                  href={item.href}
                  className="text-sm font-semibold text-navy hover:text-navy-light transition-colors"
                >
                  {item.label}
                </a>
              </span>
            ))}
          </nav>

          {/* CTAs + idioma derecha: ocupa toda su columna y reparte con aire */}
          <div className="hidden lg:flex items-center justify-between w-full gap-2 lg:col-start-3 lg:row-start-1 lg:justify-self-stretch lg:pl-6">
            {ctaButtons.map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                className={`inline-flex items-center h-8 text-[11px] xl:text-xs px-2.5 xl:px-4 rounded-full font-medium transition whitespace-nowrap ${
                  btn.solid
                    ? 'bg-navy text-white font-semibold shadow hover:bg-navy-light'
                    : 'border border-navy-light text-navy-light hover:bg-navy-light hover:text-white'
                }`}
              >
                {btn.label === 'Busca tu propiedad' && <Search size={12} className="mr-1.5 shrink-0" />}
                {btn.label}
              </a>
            ))}
            <div className="relative ml-1">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 px-2.5 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50"
                aria-label="Idioma: Español"
              >
                <Flag code="pe" />
                <span>ES</span>
                <ChevronDown size={12} className="text-gray-500" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-36 rounded-lg border bg-white py-1 shadow-md text-xs">
                  {languages.map((l) => (
                    <p
                      key={l.code}
                      className={`flex items-center gap-2 px-3 py-1.5 ${l.active ? 'font-semibold text-navy' : 'text-gray-400'}`}
                    >
                      <Flag code={l.code} />
                      {l.label} — {l.active ? l.name : 'Próximamente'}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-navy hover:bg-gray-bg transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm py-2 text-navy font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {ctaButtons.map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  className={`block text-center text-sm px-4 py-2.5 rounded-full font-medium ${
                    btn.solid ? 'bg-navy text-white' : 'border border-navy-light text-navy-light'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {btn.label}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
              {languages.map((l) => (
                <span key={l.code} className="flex items-center gap-1.5">
                  <Flag code={l.code} /> {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
