import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
    }

    await dbConnect();

    const customer = await Customer.findById(session.user.id).select(
      'name email cpf phone addresses',
    );

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente nao encontrado.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      name: customer.name,
      email: customer.email,
      cpf: customer.cpf,
      phone: customer.phone,
      addresses: customer.addresses || [],
    });
  } catch (error) {
    console.error('[Conta/Perfil] GET erro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
    }

    const body = await request.json();

    await dbConnect();

    // So permite alterar nome e telefone
    const updateData: { name?: string; phone?: string } = {};

    if (body.name && body.name.trim().length >= 2) {
      updateData.name = body.name.trim();
    }

    if (body.phone && body.phone.trim().length >= 8) {
      updateData.phone = body.phone.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum dado valido para atualizar.' },
        { status: 400 },
      );
    }

    await Customer.findByIdAndUpdate(session.user.id, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Conta/Perfil] PUT erro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}
