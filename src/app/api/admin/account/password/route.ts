import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth-helpers';

// PUT /api/admin/account/password
export async function PUT(request: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    // Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos sao obrigatorios' },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'A nova password deve ter no minimo 6 caracteres',
        },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'As passwords nao coincidem' },
        { status: 400 },
      );
    }

    // Find user with password field
    const user = await User.findOne({ email: session?.user?.email }).select(
      '+password',
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilizador nao encontrado' },
        { status: 404 },
      );
    }

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Password atual incorreta' },
        { status: 401 },
      );
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password alterada com sucesso',
    });
  } catch (err) {
    console.error('Error changing password:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao alterar password' },
      { status: 500 },
    );
  }
}
