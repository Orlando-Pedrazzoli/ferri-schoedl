import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { seedAll } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação admin
    const token = await getToken({ req: request });
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Ler parâmetro force da URL
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    if (force) {
      console.log('⚠️  RESEED FORÇADO — dados existentes serão substituídos.');
    }

    const result = await seedAll(force);

    return NextResponse.json({
      success: true,
      forced: force,
      result,
    });
  } catch (error) {
    console.error('Erro no seed:', error);
    return NextResponse.json(
      { error: 'Erro ao executar seed' },
      { status: 500 },
    );
  }
}
