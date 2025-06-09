import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useSearchParams } from 'next/navigation';

interface OAuthButtonProps {
    provider: 'google';
    className?: string;
}

export function OAuthButton({ provider, className }: OAuthButtonProps) {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const handleOAuthSignIn = async () => {
        try {
            await signIn(provider, {
                callbackUrl: '/dashboard',
                redirect: true,
            });
        } catch (error) {
            console.error('OAuth sign in error:', error);
        }
    };

    return (
        <Button
            variant="outline"
            type="button"
            className={className}
            onClick={handleOAuthSignIn}
        >
            {provider === 'google' && <FcGoogle className="mr-2 h-5 w-5" />}
            Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </Button>
    );
} 