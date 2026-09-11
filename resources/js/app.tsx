import '../css/app.css';
import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true }) as Record<
      string,
      { default: React.ComponentType }
    >;
    const page = pages[`./Pages/${name}.tsx`];
    if (!page) throw new Error(`Página no encontrada: ${name}`);
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  title: (title) => (title ? `${title} — COVESA` : 'COVESA — Inmobiliaria & Constructora'),
});
