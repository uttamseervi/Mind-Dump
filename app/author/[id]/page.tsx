'use client'
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BlogPostCard } from '@/components/blog-post-card';
import { db } from '@/lib/db';
import { MotionDiv } from '@/components/motion-div';

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

  // Get unique categories from posts
  const categories = Array.from(new Set(author.posts.map(post => post.category)));

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <Avatar className="w-24 h-24 md:w-32 md:h-32">
          <AvatarImage src={author.image || ''} alt={author.name || ''} />
          <AvatarFallback className="text-3xl">{author.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{author.name}</h1>
          <p className="text-muted-foreground mb-4">@{author.email}</p>
          <p className="max-w-2xl">{author.bio || 'No bio available'}</p>
        </div>
      </div>

      <Separator className="mb-8" />

      <h2 className="text-2xl font-semibold mb-6">Published articles ({author.posts.length})</h2>

      {author.posts.length > 0 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category || 'uncategorized'} value={category || 'uncategorized'}>
                {category || 'Uncategorized'}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {author.posts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
          {categories.map(category => (
            <TabsContent key={category || 'uncategorized'} value={category || 'uncategorized'}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {author.posts
                  .filter(post => post.category === category)
                  .map(post => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p className="text-muted-foreground">This author hasn't published any posts yet.</p>
      )}
    </MotionDiv>
  );
}