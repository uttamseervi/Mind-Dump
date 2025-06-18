import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { createNotification } from '../notifications/route';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        // Get like count and users who liked
        const [likeCount, likes] = await Promise.all([
            db.like.count({
                where: { postId },
            }),
            db.like.findMany({
                where: { postId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        // Check if current user has liked
        let liked = false;
        if (userEmail) {
            const user = await db.user.findUnique({
                where: { email: userEmail },
            });
            if (user) {
                const userLike = await db.like.findUnique({
                    where: {
                        postId_userId: {
                            postId,
                            userId: user.id,
                        },
                    },
                });
                liked = !!userLike;
            }
        }

        return NextResponse.json({
            postId,
            likeCount,
            liked,
            likes: likes.map(like => like.user)
        });
    } catch (error) {
        console.error('Error fetching likes:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { postId } = body;

        if (!postId) {
            return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let liked: boolean;

        const existingLike = await db.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId: user.id,
                },
            },
        });

        if (existingLike) {
            await db.like.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId: user.id,
                    },
                },
            });
            liked = false;
        } else {
            await db.like.create({
                data: {
                    postId,
                    userId: user.id,
                },
            });
            liked = true;

            // Create notification for the post author
            const post = await db.post.findUnique({
                where: { id: postId },
                include: { author: true },
            });

            if (post && post.authorId !== user.id) {
                await createNotification({
                    type: 'LIKE',
                    recipientId: post.authorId,
                    senderId: user.id,
                    postId: postId,
                    message: `${user.name || 'Someone'} liked your post "${post.title}"`,
                });
            }
        }

        // Get updated like count after the operation
        const likeCount = await db.like.count({
            where: { postId },
        });

        return NextResponse.json({ liked, likeCount });
    } catch (error) {
        console.error('Error toggling like:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
