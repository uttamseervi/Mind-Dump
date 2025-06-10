'use client';

import { useRouter } from 'next/navigation';
import { OAuthButton } from '@/components/oauth-button';
import { MotionDiv } from '@/components/motion-div';

export default function LoginPage() {
  const router = useRouter();

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16 max-w-md"
    >
      <div className="bg-card border rounded-lg p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in with your Google account to continue
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3">Your Digital Garden Awaits</h2>
            <p className="text-muted-foreground">
              Continue your journey of knowledge sharing and discovery. Access your personalized dashboard, manage your posts, and connect with other writers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="font-medium">Write & Share</span>
              <p className="text-muted-foreground mt-1">Share your thoughts with the world</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="font-medium">Connect</span>
              <p className="text-muted-foreground mt-1">Engage with like-minded writers</p>
            </div>
          </div>
        </div>

        <OAuthButton provider="google" className="w-full" />
      </div>
    </MotionDiv>
  );
}