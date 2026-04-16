// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // --- Protecção de /admin/* (apenas admin/editor) ---
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'admin' && token?.role !== 'editor') {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }

    // --- Protecção de /conta/* (apenas customer) ---
    if (
      pathname.startsWith('/conta') &&
      !pathname.startsWith('/conta/login') &&
      !pathname.startsWith('/conta/registro') &&
      !pathname.startsWith('/conta/verificar-email')
    ) {
      if (token?.role !== 'customer') {
        return NextResponse.redirect(new URL('/conta/login', req.url));
      }
    }

    // NOTA: /checkout é PÚBLICO (guest checkout).
    // A autenticação acontece dentro do CheckoutForm via modal OTP,
    // apenas no momento de enviar o pedido ao Pagar.me.

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Rotas publicas dentro de /conta
        if (
          pathname === '/conta/login' ||
          pathname === '/conta/registro' ||
          pathname.startsWith('/conta/verificar-email')
        ) {
          return true;
        }

        // Todas as outras rotas no matcher precisam de token
        return !!token;
      },
    },
    pages: {
      signIn: '/conta/login',
    },
  },
);

// IMPORTANTE: /checkout REMOVIDO do matcher para permitir guest checkout
export const config = {
  matcher: ['/admin/((?!login).*)', '/conta/:path*'],
};
