'use client';

import { OAuthButton } from '@/components/oauth-button';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-card rounded-lg border shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground text-sm">
            Join Interview Hub to access interview resources
          </p>
        </div>
        
        <div className="space-y-4">
          <OAuthButton provider="google" className="w-full" />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
        </div>
        {/* comment */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
        
        <p className="text-xs text-muted-foreground text-center px-4">
          By creating an account, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}