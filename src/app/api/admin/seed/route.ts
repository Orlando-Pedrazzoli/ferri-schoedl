import { NextRequest, NextResponse } from 'next/server';
import { seedAll } from '@/lib/seed';
import { requireAdmin } from '@/lib/auth-helpers';

// POST protegido (para uso no dashboard depois do primeiro login)
export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const results = await seedAll();
    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao executar seed' },
      { status: 500 },
    );
  }
}

// GET publico temporario — usar uma unica vez para criar o admin
// APAGAR ESTE METODO DEPOIS DO PRIMEIRO SEED
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Secret invalido' },
      { status: 401 },
    );
  }

  try {
    const results = await seedAll();
    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao executar seed' },
      { status: 500 },
    );
  }
}
