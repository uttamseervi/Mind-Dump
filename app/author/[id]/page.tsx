import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { AuthorProfile } from '../author-profile';

interface AuthorProfilePageProps {
  params: { id: string };
}

export default async function AuthorProfilePage({ params }: AuthorProfilePageProps) {
  const author = await db.user.findUnique({
    where: { id: params.id },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!author) {
    notFound();
  }

  return <AuthorProfile author={author} />;
}