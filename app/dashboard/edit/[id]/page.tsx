import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostEditor } from '@/components/post-editor';
import { MotionDiv } from '@/components/motion-div';
import { Skeleton } from '@/components/ui/skeleton';

interface EditPostPageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        console.log("the post response is ", response)
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleSubmit = async (data: any, isDraft: boolean) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          published: !isDraft,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl">Post not found or you don&apos;t have permission to edit it.</p>
      </div>
    );
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostEditor
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        defaultValues={post}
      />
    </MotionDiv>
  );
}