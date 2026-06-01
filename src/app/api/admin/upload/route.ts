import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { uploadToCloudinary, uploadPdfToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'ferri-schoedl';
    const kind = (formData.get('kind') as string) || 'image';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum ficheiro enviado' },
        { status: 400 },
      );
    }

    // -------- PDF (eBook privado) --------
    if (kind === 'pdf') {
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { success: false, error: 'Tipo de ficheiro não permitido. Use PDF.' },
          { status: 400 },
        );
      }

      // Atenção: na Vercel o corpo da função serverless é limitado (~4,5MB).
      // PDFs maiores devem usar upload assinado direto para o Cloudinary.
      const maxSize = 60 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'Ficheiro muito grande. Máximo 60MB.' },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadPdfToCloudinary(buffer, { folder });

      return NextResponse.json({
        success: true,
        data: {
          fileId: result.publicId,
          fileName: file.name,
          size: result.bytes,
        },
      });
    }

    // -------- Imagem (default) --------
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tipo de ficheiro não permitido. Use JPEG, PNG, WebP ou GIF.',
        },
        { status: 400 },
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Ficheiro muito grande. Máximo 10MB.' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadToCloudinary(buffer, { folder });

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer upload do ficheiro' },
      { status: 500 },
    );
  }
}
