'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BlogPostCard } from '@/components/blog-post-card';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchSection } from '@/components/search-section';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/categories';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

export default function BlogFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 6;

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const skip = (page - 1) * postsPerPage;
      const params = new URLSearchParams({
        skip: skip.toString(),
        take: postsPerPage.toString(),
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      if (selectedTag) {
        params.append('tag', selectedTag);
      }
      if (searchQuery) {
        params.append('query', searchQuery);
      }

      const response = await fetch(`/api/posts?${params.toString()}`);
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

  useEffect(() => {
    setPage(1);
    setPosts([]);
    fetchPosts();
  }, [selectedCategory, selectedTag, searchQuery]);

  const { targetRef } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    onIntersect: () => {
      if (hasMore && !isLoading) {
        setPage(prevPage => prevPage + 1);
        fetchPosts();
      }
    },
  });

  // Get unique tags from all posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

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

          {/* Search and Filter Section */}
          <div className="mb-10 space-y-6">
            <SearchSection
              onSearch={setSearchQuery}
              onCategorySelect={setSelectedCategory}
              selectedCategory={selectedCategory}
            />

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      className={`cursor-pointer ${selectedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

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

          {/* Loading indicator for infinite scroll */}
          {isLoading && page > 1 && (
            <div className="flex justify-center mt-8">
              <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          )}

          {/* Intersection observer target */}
          {hasMore && (
            <div ref={targetRef} className="h-10" />
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