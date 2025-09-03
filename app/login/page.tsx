'use client';

import { OAuthButton } from '@/components/oauth-button';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-card rounded-lg border shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to continue to Interview Hub
          </p>
        </div>
        
        <OAuthButton provider="google" className="w-full" />
        
        <p className="text-xs text-muted-foreground text-center px-4">
          By continuing, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}