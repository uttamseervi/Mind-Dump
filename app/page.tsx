'use client'
import { BlogFeed } from '@/components/blog-feed';
import { FeaturedPosts } from '@/components/featured-posts';
import { HeroSection } from '@/components/hero-section';
import { SearchSection } from '@/components/search-section';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <SearchSection />
      <FeaturedPosts />
      {/* <BlogFeed /> */}
    </div>
  );
}