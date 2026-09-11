import type { ReactNode } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
