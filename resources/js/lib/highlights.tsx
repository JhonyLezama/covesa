import type { ReactNode } from 'react';

/**
 * Resaltados en descripciones: **palabra** se renderiza en MAYÚSCULAS
 * + negrita blanca (cards de Servicios). Sin marcadores, texto plano.
 */
export function renderHighlights(text: string, strongClass = 'font-bold uppercase text-white'): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={strongClass}>
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
