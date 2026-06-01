import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth-helpers';

export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { success: false, error: 'Cloudinary não configurado' },
      { status: 500 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'ferri-schoedl/ebooks';

  // Estes parâmetros são assinados E enviados no upload (devem bater exatamente).
  // 'type: authenticated' => asset privado, acessível só por URL assinada.
  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
    type: 'authenticated',
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return NextResponse.json({
    success: true,
    data: { signature, timestamp, apiKey, cloudName, folder },
  });
}
