import type { ReactNode } from 'react';
import Header from '../Components/Header';
import Footer, { type PublicSettings } from '../Components/Footer';
import FloatingContacts from '../Components/FloatingContacts';

interface PublicLayoutProps {
  children: ReactNode;
  settings?: PublicSettings;
}

/**
 * Layout del sitio público: header + footer del PDF y flotantes
 * globales (badges de proyectos + WhatsApp) en TODAS las páginas.
 */
export default function PublicLayout({ children, settings }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white font-display">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingContacts whatsapp={settings?.whatsapp} />
    </div>
  );
}
