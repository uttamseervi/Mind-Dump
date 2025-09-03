import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Eye, Clock, Share2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/db';
import { MotionDiv } from '@/components/motion-div';
import BlogInteractions from '../BlogInteractions';
import { toast } from 'sonner';
import ShareButton from './ShareButton';

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
  
  // Update view count in the background, but don't block rendering
  try {
    await db.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error('Failed to update view count:', error);
    // Continue rendering even if view count update fails
  }

  const readTime = estimateReadTime(post.content);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 grid gap-6">
          {/* Title and Meta */}
          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md dark:bg-gray-800 dark:text-gray-200">
                      {post.category}
                    </span>
                    {post.difficulty && (
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium text-black ${
                          post.difficulty.toLowerCase() === 'easy' 
                            ? 'bg-blue-500/20 dark:bg-blue-500/50' 
                            : post.difficulty.toLowerCase() === 'medium' 
                              ? 'bg-yellow-500/50'
                              : 'bg-red-500/20 dark:bg-red-500/50'
                        }`}
                      >
                        {post.difficulty.toLowerCase()}
                      </span>
                    )}
                    {post.companyName && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md dark:bg-gray-800 dark:text-gray-200">
                        {post.companyName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton title={post.title} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <Link href={`/author/${post.author.id}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.image || ''} alt={post.author.name || ''} />
                    <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{post.author.name}</span>
                </Link>
                <Separator orientation="vertical" className="h-4" />
                <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} min read</span>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Image Section */}
          {post.image && (
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="relative w-full aspect-video">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
          )}

          {/* Content Section */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="pt-6">
              {post.description && (
                <p className="text-lg text-muted-foreground mb-8 font-medium">
                  {post.description}
                </p>
              )}
              <article
                className="prose prose-lg dark:prose-invert max-w-none [&_*]:!text-foreground [&_*]:!text-base [&_h1]:!text-4xl [&_h2]:!text-3xl [&_h3]:!text-2xl [&_h4]:!text-xl [&_p]:!my-4 [&_ul]:!my-4 [&_ol]:!my-4 [&_li]:!my-2 [&_a]:!text-blue-500 [&_a]:!no-underline hover:[&_a]:!underline [&_img]:!rounded-lg [&_img]:!my-4 [&_blockquote]:!border-l-4 [&_blockquote]:!border-gray-300 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_code]:!bg-gray-100 dark:[&_code]:!bg-black dark:[&_code]:!text-white [&_code]:!px-2 [&_code]:!py-1 [&_code]:!rounded [&_pre]:!bg-gray-100 dark:[&_pre]:!bg-black dark:[&_pre]:!text-white [&_pre]:!p-4 [&_pre]:!rounded-lg [&_pre]:!overflow-x-auto [&_strong]:!font-bold [&_em]:!italic [&_ul]:!list-disc [&_ul]:!pl-6 [&_ol]:!list-decimal [&_ol]:!pl-6 [&_h3]:!mt-8 [&_h3]:!mb-4 [&_h4]:!mt-6 [&_h4]:!mb-3 [&_ul]:!space-y-2 [&_ol]:!space-y-2 [&_li]:!leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 grid gap-6 content-start">
          {/* Author Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={post.author.image || ''} alt={post.author.name || ''} />
                  <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{post.author.name}</h3>

                </div>
                <p className="text-sm text-muted-foreground">
                  Posted on {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <h3 className="font-semibold">Table of Contents</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {/* This would be dynamically generated from the content headings */}
                <a href="#overview" className="block hover:text-primary transition-colors">
                  • Overview
                </a>
                <a href="#preparation" className="block hover:text-primary transition-colors">
                  • Preparation
                </a>
                <a href="#interview-process" className="block hover:text-primary transition-colors">
                  • Interview Process
                </a>
                <a href="#questions" className="block hover:text-primary transition-colors">
                  • Questions Asked
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Author Section */}
          <Card className="bg-muted/20 shadow-sm hover:shadow-md transition-shadow duration-200">
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
          </Card>
        </div>
      </div>
      
      <div className="col-span-full">
        <BlogInteractions postId={post.id} />
      </div>
    </MotionDiv>
  );
}