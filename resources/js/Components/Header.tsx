import { useState } from 'react';
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';

interface HeaderProps {
  navItems?: { label: string; href: string }[];
  ctaButtons?: { label: string; href: string; variant: 'primary' | 'secondary' | 'accent' }[];
}

const defaultNavItems = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'CV Blog', href: '#blog' },
];

const defaultCtaButtons = [
  { label: 'Busca tu propiedad', href: '#buscador', variant: 'primary' as const },
  { label: 'Vende con nosotros', href: '#contacto', variant: 'accent' as const },
  { label: 'Refiere y gana', href: '#refiere', variant: 'secondary' as const },
];

export default function Header({ navItems = defaultNavItems, ctaButtons = defaultCtaButtons }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-navy text-white sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-navy-dark hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+5114218900" className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <Phone size={13} />
                <span>(01) 421-8900</span>
              </a>
              <a href="mailto:info@covesa.com.pe" className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <Mail size={13} />
                <span>info@covesa.com.pe</span>
              </a>
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <MapPin size={13} />
              <span>Av. Javier Prado Este 1234, San Isidro, Lima</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-navy-dark font-medium text-lg">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium tracking-tight leading-none">COVESA</span>
              <span className="text-[10px] opacity-70 tracking-widest uppercase">Inmobiliaria</span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm opacity-85 hover:opacity-100 transition-opacity relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold hover:after:w-full after:transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {ctaButtons.map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                className={`text-xs px-3 py-2 rounded-md transition-colors ${
                  btn.variant === 'primary'
                    ? 'bg-white text-navy hover:bg-gray-100'
                    : btn.variant === 'accent'
                    ? 'bg-gold text-navy-dark hover:bg-gold-dark'
                    : 'border border-white/30 text-white hover:bg-white/10'
                }`}
              >
                {btn.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-dark border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm py-2 opacity-85 hover:opacity-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 space-y-2">
              {ctaButtons.map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  className={`block text-center text-sm px-4 py-2.5 rounded-md transition-colors ${
                    btn.variant === 'primary'
                      ? 'bg-white text-navy'
                      : btn.variant === 'accent'
                      ? 'bg-gold text-navy-dark'
                      : 'border border-white/30 text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {btn.label}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-white/10 space-y-2 text-sm opacity-70">
              <a href="tel:+5114218900" className="flex items-center gap-2 py-1">
                <Phone size={14} /> (01) 421-8900
              </a>
              <a href="mailto:info@covesa.com.pe" className="flex items-center gap-2 py-1">
                <Mail size={14} /> info@covesa.com.pe
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
