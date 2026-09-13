import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { FormEvent } from 'react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route('login.store'));
  };

  return (
    <>
      <Head title="Iniciar sesión" />
      <div className="min-h-screen bg-gray-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6 text-center">
            <p className="text-2xl font-medium text-navy">COVESA</p>
            <h1 className="mt-1 text-lg font-medium text-gray-text">Panel interno</h1>
            <p className="mt-1 text-sm text-gray-muted">
              Acceso solo para el equipo. Sin registro público.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-text mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                autoFocus
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-text mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60"
            >
              {processing ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
