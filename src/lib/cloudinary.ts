import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// ============================================================
// Imagens (público)
// ============================================================
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options?: {
    folder?: string;
    publicId?: string;
    transformation?: Record<string, unknown>[];
  },
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  const folder = options?.folder || 'ferri-schoedl';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options?.publicId,
        resource_type: 'image',
        transformation: options?.transformation || [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        } else {
          reject(new Error('Upload sem resultado'));
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
}

// ============================================================
// eBooks PDF (privado / autenticado)
// ============================================================
// Sobe como raw autenticado: NÃO é acessível por URL pública.
export async function uploadPdfToCloudinary(
  fileBuffer: Buffer,
  options?: { folder?: string; publicId?: string },
): Promise<{ publicId: string; url: string; bytes: number }> {
  const folder = options?.folder || 'ferri-schoedl/ebooks';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options?.publicId,
        resource_type: 'raw',
        type: 'authenticated',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
            bytes: result.bytes,
          });
        } else {
          reject(new Error('Upload sem resultado'));
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
}

// Gera uma URL assinada e temporária para o PDF privado.
// Importante: o `type` precisa ser o mesmo usado no upload ('authenticated').
export function getEbookDownloadUrl(
  publicId: string,
  fileName?: string,
  expiresInSeconds = 300,
): string {
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'authenticated',
    secure: true,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
    attachment: fileName || true,
  });
}

// ============================================================
// Delete (imagem ou raw)
// ============================================================
export async function deleteFromCloudinary(
  publicId: string,
  options?: {
    resourceType?: 'image' | 'raw';
    type?: 'upload' | 'authenticated' | 'private';
  },
): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: options?.resourceType || 'image',
      type: options?.type || 'upload',
    });
    return result.result === 'ok';
  } catch {
    console.error('Error deleting from Cloudinary:', publicId);
    return false;
  }
}
