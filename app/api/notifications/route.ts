import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Get user's notifications
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const unreadOnly = searchParams.get('unread') === 'true';

        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const whereClause = {
            recipientId: user.id,
            ...(unreadOnly && { read: false }),
        };

        const [notifications, totalCount] = await Promise.all([
            db.notification.findMany({
                where: whereClause,
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                    comment: {
                        select: {
                            id: true,
                            content: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.notification.count({ where: whereClause }),
        ]);

        return NextResponse.json({
            notifications,
            totalCount,
            hasMore: totalCount > page * limit,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Mark notifications as read
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { notificationIds, markAllAsRead } = body;

        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (markAllAsRead) {
            // Mark all unread notifications as read
            await db.notification.updateMany({
                where: {
                    recipientId: user.id,
                    read: false,
                },
                data: { read: true },
            });
        } else if (notificationIds && Array.isArray(notificationIds)) {
            // Mark specific notifications as read
            await db.notification.updateMany({
                where: {
                    id: { in: notificationIds },
                    recipientId: user.id,
                },
                data: { read: true },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating notifications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Create a notification (internal use)
export async function createNotification(data: {
    type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
    recipientId: string;
    senderId?: string;
    postId?: string;
    commentId?: string;
    message: string;
}) {
    try {
        const notification = await db.notification.create({
            data: {
                type: data.type,
                message: data.message,
                recipientId: data.recipientId,
                senderId: data.senderId,
                postId: data.postId,
                commentId: data.commentId,
            },
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
} 