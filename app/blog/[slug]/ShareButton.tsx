'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonProps {
    title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: title,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error('Failed to share');
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
        >
            <Share2 className="w-4 h-4 mr-2" />
            Share
        </Button>
    );
} 