'use client';

import { motion } from 'framer-motion';
import { Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrepGuidesPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <BookOpen className="h-10 w-10 text-primary" />
        </motion.div>
        
        <h1 className="text-4xl font-bold mb-4">Prep Guides Coming Soon!</h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          We're working hard to bring you comprehensive preparation guides to help you ace your interviews.
        </p>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
          <Clock className="h-4 w-4" />
          <span>Stay tuned for updates!</span>
        </div>
        
        <Button asChild>
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
