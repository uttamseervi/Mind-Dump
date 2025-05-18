'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, truncateText, getReadingTime } from '@/lib/utils';

interface BlogPostCardProps {
  post: any;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden h-full flex flex-col">
          <div className="relative h-5 w-full">
            {/* {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )} */}
            <div className="absolute top-2 left-2">
              <Badge>{post.category}</Badge>
            </div>
          </div>
          
          <CardContent className="pt-6 pb-3 flex-grow">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-muted-foreground mb-4">
              {post.content && truncateText(post.content.replace(/<[^>]*>/g, ''), 120)}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags && post.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="border-t px-6 py-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author?.image || ''} alt={post.author?.name || ''} />
                  <AvatarFallback>{getInitials(post.author?.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{post.author?.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {post.createdAt && format(new Date(post.createdAt), 'MMM d, yyyy')} • {post.content && getReadingTime(post.content)} min read
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}