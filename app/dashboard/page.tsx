import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MotionDiv } from '@/components/motion-div';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostActions } from '@/components/post-actions';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    redirect('/api/auth/signin');
  }

  const publishedPosts = user.posts.filter(post => post.published);
  const draftPosts = user.posts.filter(post => !post.published);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/new">Create New Post</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Stats about your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Total Posts</p>
              <p className="text-3xl font-bold">{user.posts.length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Published</p>
              <p className="text-3xl font-bold">{publishedPosts.length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Drafts</p>
              <p className="text-3xl font-bold">{draftPosts.length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Total Views</p>
              <p className="text-3xl font-bold">
                {user.posts.reduce((sum, post) => sum + post.views, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="published" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="published">
          {publishedPosts.length > 0 ? (
            <div className="grid gap-4">
              {publishedPosts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(post.createdAt), 'MMMM d, yyyy')} • {post.views} views
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{post.category}</Badge>
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/blog/${post.slug}`}>View Post</Link>
                    </Button>
                    <PostActions post={post} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No published posts yet. Create your first post!
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="drafts">
          {draftPosts.length > 0 ? (
            <div className="grid gap-4">
              {draftPosts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      Last edited: {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/edit/${post.id}`}>Continue Editing</Link>
                    </Button>
                    <PostActions post={post} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No draft posts. Drafts you create will appear here.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </MotionDiv>
  );
}
