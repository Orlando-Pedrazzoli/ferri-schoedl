'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/components/CartProvider';
import { CartDrawer } from '@/components/CartDrawer';
import { CookieConsent } from '@/components/CookieConsent';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider>
      <CartProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <CookieConsent />
      </CartProvider>
    </ThemeProvider>
  );
}
