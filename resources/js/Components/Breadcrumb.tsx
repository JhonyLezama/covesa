import { Head } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${origin}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <nav aria-label="breadcrumb" className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-gray-bg px-4 py-2 text-xs font-display">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          const isHome = i === 0 && item.href === '/';
          return (
            <span key={item.label} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && (
                <ChevronRight size={12} className="shrink-0 text-gold-dark" aria-hidden="true" />
              )}
              {item.href && !last ? (
                <a
                  href={item.href}
                  aria-label={item.label}
                  className="flex shrink-0 items-center gap-1 font-medium text-navy transition-colors hover:text-navy-light"
                >
                  {isHome && <Home size={12} aria-hidden="true" />}
                  <span className={isHome ? 'hidden sm:inline' : undefined}>{item.label}</span>
                </a>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="truncate font-semibold text-navy-dark">
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
