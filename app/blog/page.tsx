'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BlogPostCard } from '@/components/blog-post-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const skip = (page - 1) * postsPerPage;
        const response = await fetch(`/api/posts?skip=${skip}&take=${postsPerPage}`);
        const data = await response.json();
        
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prevPosts => [...prevPosts, ...data.posts]);
        }
        
        setHasMore(data.posts.length === postsPerPage);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-2">Latest Posts</h2>
          <p className="text-muted-foreground mb-10">Explore all our articles</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
            
            {isLoading && page === 1 && (
              Array(postsPerPage).fill(0).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-48 rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            )}
          </div>
          
          {posts?.length > 0 && hasMore && (
            <div className="flex justify-center mt-12">
              <Button 
                variant="outline" 
                onClick={() => setPage(prevPage => prevPage + 1)}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
          
          {posts?.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground">
              No posts found. Check back later or try a different filter.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}