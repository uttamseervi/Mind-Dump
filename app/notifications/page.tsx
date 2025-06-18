'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Check, Trash2, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

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

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'likes' | 'comments'>('all');
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications
    const fetchNotifications = async (pageNum = 1, reset = false) => {
        if (!session?.user) return;

        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pageNum.toString(),
                limit: '20',
            });

            if (filter === 'unread') {
                params.append('unread', 'true');
            }

            const response = await axios.get(`/api/notifications?${params}`);

            if (reset) {
                setNotifications(response.data.notifications);
            } else {
                setNotifications(prev => [...prev, ...response.data.notifications]);
            }

            setHasMore(response.data.hasMore);

            // Count unread notifications
            const unread = response.data.notifications.filter((n: Notification) => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
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

    // Load more notifications
    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchNotifications(nextPage, false);
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

    // Filter notifications based on type
    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notification.read;
        if (filter === 'likes') return notification.type === 'LIKE';
        if (filter === 'comments') return notification.type === 'COMMENT';
        return true;
    });

    useEffect(() => {
        if (session?.user) {
            setPage(1);
            fetchNotifications(1, true);
        }
    }, [session, filter]);

    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Sign in to view notifications</h2>
                        <p className="text-muted-foreground mb-4">
                            You need to be signed in to see your notifications.
                        </p>
                        <Button asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground">
                        Stay updated with your latest activity
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outline">
                        <Check className="h-4 w-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filter:</span>
                </div>
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="likes">Likes</SelectItem>
                        <SelectItem value="comments">Comments</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
                {loading && page === 1 ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center h-32">
                            <div className="text-center">
                                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                                <p className="text-muted-foreground">
                                    {filter === 'all'
                                        ? "You're all caught up! Check back later for new notifications."
                                        : `No ${filter} notifications found.`
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`transition-colors ${!notification.read ? 'bg-muted/50 border-l-4 border-l-blue-500' : ''
                                }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {notification.sender ? (
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={notification.sender.image || ''} />
                                                <AvatarFallback>
                                                    {notification.sender.name?.[0] || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 ml-4">
                                                <Badge variant="outline" className="text-xs">
                                                    {notification.type}
                                                </Badge>
                                                {!notification.read && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {notification.post && (
                                            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                                <Link
                                                    href={`/blog/${notification.post.slug}`}
                                                    className="text-sm font-medium hover:underline"
                                                >
                                                    {notification.post.title}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Load more button */}
            {hasMore && !loading && (
                <div className="flex justify-center mt-8">
                    <Button
                        onClick={loadMore}
                        variant="outline"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load more'}
                    </Button>
                </div>
            )}
        </div>
    );
} 