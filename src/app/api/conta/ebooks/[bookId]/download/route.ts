import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { hasEbookAccess } from '@/lib/access';
import { getEbookDownloadUrl } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  const { bookId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'customer') {
    return NextResponse.json(
      { error: 'Autenticação necessária.' },
      { status: 401 },
    );
  }

  await dbConnect();

  const book = await Book.findById(bookId).select(
    'hasEbook ebookFileId ebookFileName title',
  );
  if (!book || !book.hasEbook || !book.ebookFileId) {
    return NextResponse.json(
      { error: 'eBook não disponível.' },
      { status: 404 },
    );
  }

  const allowed = await hasEbookAccess({
    email: session.user.email,
    customerId: session.user.id,
    bookId,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Você não tem acesso a este eBook.' },
      { status: 403 },
    );
  }

  // URL assinada e temporária do Cloudinary
  const url = getEbookDownloadUrl(
    book.ebookFileId,
    book.ebookFileName || `${book.title}.pdf`,
  );

  return NextResponse.redirect(url);
}
