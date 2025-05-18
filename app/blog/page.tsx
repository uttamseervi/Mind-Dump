'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { db } from '@/lib/db';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default async function BlogPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Blog Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden bg-card text-foreground">
            {post.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.author.image || ''} alt={post.author.name || ''} />
                  <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author.name || 'Anonymous'}</span>
                <span>•</span>
                <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </CardHeader>

            <CardContent className="mt-auto">
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
            </CardContent>

            <CardFooter className="mt-auto">
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Read more →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
