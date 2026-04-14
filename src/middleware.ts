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

    // --- Protecção de /checkout/* (apenas customer) ---
    if (pathname.startsWith('/checkout')) {
      if (token?.role !== 'customer') {
        return NextResponse.redirect(
          new URL('/conta/login?redirect=/checkout', req.url),
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Permitir acesso sem autenticação a rotas públicas dentro do matcher
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Rotas de conta que não precisam de autenticação
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

export const config = {
  matcher: ['/admin/((?!login).*)', '/conta/:path*', '/checkout/:path*'],
};
