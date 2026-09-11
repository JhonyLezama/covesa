export interface Property {
  image: string;
  title: string;
  location: string;
  area: string;
  idealFor?: string;
  status: 'venta' | 'alquiler' | 'concluido' | 'construccion';
  price?: string;
  href?: string;
}

export interface PageProps {
  flash?: {
    success?: string;
  };
  errors?: Record<string, string>;
}
