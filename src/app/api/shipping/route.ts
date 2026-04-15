import { NextRequest, NextResponse } from 'next/server';
import { calcularFreteReal, getRegiaoLabel } from '@/lib/shipping';

/**
 * POST /api/shipping
 * Calcula frete baseado em CEP de destino e peso total
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cep, weightG } = body;

    if (!cep || !weightG) {
      return NextResponse.json(
        { error: 'CEP e peso sao obrigatorios.' },
        { status: 400 },
      );
    }

    const cepClean = String(cep).replace(/\D/g, '');
    if (cepClean.length !== 8) {
      return NextResponse.json({ error: 'CEP invalido.' }, { status: 400 });
    }

    const opcoes = calcularFreteReal(cepClean, Number(weightG));

    if (opcoes.length === 0) {
      return NextResponse.json(
        { error: 'Nao foi possivel calcular o frete para este CEP.' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      regiao: getRegiaoLabel(cepClean),
      opcoes,
    });
  } catch (error) {
    console.error('[Shipping] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular frete.' },
      { status: 500 },
    );
  }
}
