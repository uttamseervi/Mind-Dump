'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PostEditor } from '@/components/post-editor';
import { MotionDiv } from '@/components/motion-div';
import { Card, CardContent } from '@/components/ui/card';

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any, isDraft: boolean) => {
    try {
      setIsSubmitting(true);

      const response = await axios.post('/api/posts', {
        ...data,
        published: !isDraft,
      });

      const post = response.data;
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center min-h-screen py-10"
    >
      <Card className="w-[80%]">
        <CardContent className="py-8 px-6">
          <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
          <PostEditor onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
