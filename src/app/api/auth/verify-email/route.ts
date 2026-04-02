import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/conta/login?error=Token+inválido', request.url),
      );
    }

    await dbConnect();

    // Buscar customer pelo token (select + campos de verificação)
    const customer = await Customer.findOne({
      emailVerificationToken: token,
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!customer) {
      return NextResponse.redirect(
        new URL('/conta/login?error=Token+inválido+ou+expirado', request.url),
      );
    }

    // Verificar expiração
    if (
      customer.emailVerificationExpires &&
      customer.emailVerificationExpires < new Date()
    ) {
      return NextResponse.redirect(
        new URL(
          '/conta/login?error=Token+expirado.+Faça+login+para+reenviar+o+email+de+verificação',
          request.url,
        ),
      );
    }

    // Já verificado?
    if (customer.emailVerified) {
      return NextResponse.redirect(
        new URL(
          '/conta/login?message=Email+já+verificado.+Faça+login',
          request.url,
        ),
      );
    }

    // Activar conta
    customer.emailVerified = true;
    customer.emailVerificationToken = undefined;
    customer.emailVerificationExpires = undefined;
    await customer.save();

    return NextResponse.redirect(
      new URL(
        '/conta/login?message=Email+verificado+com+sucesso!+Faça+login+para+continuar',
        request.url,
      ),
    );
  } catch (error) {
    console.error('[VerifyEmail] Erro:', error);
    return NextResponse.redirect(
      new URL('/conta/login?error=Erro+ao+verificar+email', request.url),
    );
  }
}
