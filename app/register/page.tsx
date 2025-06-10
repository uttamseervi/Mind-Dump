'use client';

import { useRouter } from 'next/navigation';
import { OAuthButton } from '@/components/oauth-button';
import { MotionDiv } from '@/components/motion-div';

export default function RegisterPage() {
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
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground mt-2">
            Sign up with your Google account to get started
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3">Start Your Writing Journey</h2>
            <p className="text-muted-foreground">
              Join our community of writers and thinkers. Share your ideas, discover new perspectives, and grow your audience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="font-medium">Easy Publishing</span>
              <p className="text-muted-foreground mt-1">Write and publish in minutes</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="font-medium">Grow Audience</span>
              <p className="text-muted-foreground mt-1">Build your reader base</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="font-medium">Rich Editor</span>
              <p className="text-muted-foreground mt-1">Format your content beautifully</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="font-medium">Analytics</span>
              <p className="text-muted-foreground mt-1">Track your content's performance</p>
            </div>
          </div>
        </div>

        <OAuthButton provider="google" className="w-full" />
      </div>
    </MotionDiv>
  );
}