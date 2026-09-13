export interface Property {
  image: string;
  title: string;
  slug?: string;
  type?: string;
  location: string;
  area: string;
  lots?: number | null;
  idealFor?: string;
  status: 'venta' | 'alquiler' | 'concluido' | 'construccion';
  price?: string;
  href?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface PageProps {
  auth?: {
    user: AuthUser | null;
  };
  flash?: {
    success?: string;
    error?: string;
  };
  errors?: Record<string, string>;
}
