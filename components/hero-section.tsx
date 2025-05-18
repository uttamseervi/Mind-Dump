'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Where Ideas Find <span className="text-primary">Expression</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Discover stories, expertise, and insights from talented writers on any topic.
              Or share your own ideas with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {/* <Button size="lg" asChild>
                <Link href="/write">Get Started</Link>
              </Button> */}
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">Explore Posts</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/3 h-2/3 bg-card border shadow-lg rounded-lg">
                  <div className="h-6 border-b flex items-center px-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="w-3/4 h-6 bg-muted rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-muted rounded"></div>
                      <div className="w-full h-3 bg-muted rounded"></div>
                      <div className="w-2/3 h-3 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}