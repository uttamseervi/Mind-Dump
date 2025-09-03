'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Check, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
    id: string;
    type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
    message: string;
    read: boolean;
    createdAt: string;
    sender?: {
        id: string;
        name: string | null;
        image: string | null;
    };
    post?: {
        id: string;
        title: string;
        slug: string;
    };
    comment?: {
        id: string;
        content: string;
    };
}

export default function NotificationBell() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!session?.user) return;

        try {
            setLoading(true);
            const response = await axios.get('/api/notifications?limit=10');
            setNotifications(response.data.notifications);

            // Count unread notifications
            const unread = response.data.notifications.filter((n: Notification) => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId: string) => {
        try {
            await axios.put('/api/notifications', {
                notificationIds: [notificationId],
            });

            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await axios.put('/api/notifications', {
                markAllAsRead: true,
            });

            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark notifications as read');
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Get notification icon based on type
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'LIKE':
                return '💖';
            case 'COMMENT':
                return '💬';
            case 'FOLLOW':
                return '👤';
            case 'MENTION':
                return '📢';
            default:
                return '🔔';
        }
    };

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    // Navigate to post
    const navigateToPost = (slug: string) => {
        window.location.href = `/interviews/${slug}`;
    };

    useEffect(() => {
        if (session?.user) {
            fetchNotifications();

            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [session]);

    if (!session?.user) return null;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-80">
                    {loading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Loading notifications...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={`p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''
                                        }`}
                                    onClick={() => {
                                        if (!notification.read) {
                                            markAsRead(notification.id);
                                        }
                                        if (notification.post?.slug) {
                                            navigateToPost(notification.post.slug);
                                        }
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex items-start gap-3 w-full">
                                        <div className="flex-shrink-0">
                                            {notification.sender ? (
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={notification.sender.image || ''} />
                                                    <AvatarFallback>
                                                        {notification.sender.name?.[0] || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>

                                        {!notification.read && (
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="p-2 border-t">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => {
                                // Navigate to full notifications page
                                window.location.href = '/notifications';
                            }}
                        >
                            View all notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 