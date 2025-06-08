'use client'
import { BlogFeed } from '@/components/blog-feed';
import { FeaturedPosts } from '@/components/featured-posts';
import { HeroSection } from '@/components/hero-section';
import { SearchSection } from '@/components/search-section';
import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <SearchSection
        onSearch={setSearchQuery}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <FeaturedPosts />
      {/* <BlogFeed /> */}
    </div>
  );
}