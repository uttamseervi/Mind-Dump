import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/db';
import { MotionDiv } from '@/components/motion-div';
import BlogInteractions from '../BlogInteractions';

interface BlogPostPageProps {
  params: { slug: string };
}

function estimateReadTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!post) notFound();

  await db.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  const readTime = estimateReadTime(post.content);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl space-y-10"
    >
      {/* Title and Meta Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl md:text-5xl font-bold">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <Link href={`/author/${post.author.id}`} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.image || ''} alt={post.author.name || ''} />
                <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{post.author.name}</span>
            </Link>
            <span>•</span>
            <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
            <span>•</span>
            <span>{post.views} views</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Section */}
      {post.image && (
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content Section */}
      <Card className='p-4 m-2'>
        <CardContent>
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>
      <BlogInteractions postId={post.id} />
    </MotionDiv>
  );
}



{/* <Card className="bg-muted/20">
<CardHeader>
  <CardTitle>About the Author</CardTitle>
</CardHeader>
<CardContent className="flex items-start gap-4">
  <Avatar className="w-16 h-16">
    <AvatarImage src={post.author.image || ''} alt={post.author.name || ''} />
    <AvatarFallback className="text-xl">{post.author.name?.charAt(0) || 'U'}</AvatarFallback>
  </Avatar>
  <div>
    <h3 className="font-medium text-lg">{post.author.name}</h3>
    <p className="text-muted-foreground mb-4">
      {post.author.bio || 'No bio available.'}
    </p>
    <Button asChild variant="outline" size="sm">
      <Link href={`/author/${post.author.id}`}>View Profile</Link>
    </Button>
  </div>
</CardContent>
</Card> */}