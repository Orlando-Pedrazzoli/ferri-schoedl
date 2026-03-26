import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Upload helper for server-side usage
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
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
}

// Delete helper
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch {
    console.error('Error deleting from Cloudinary:', publicId);
    return false;
  }
}
