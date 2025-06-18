import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { createNotification } from '../notifications/route';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');
        // console.log("postid", postId)
        if (!postId) {
            return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
        }

        const comments = await db.comment.findMany({
            where: { postId },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
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
        const { postId, content } = body;

        if (!postId || !content) {
            return NextResponse.json({ error: 'Missing postId or content' }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const comment = await db.comment.create({
            data: {
                postId,
                content,
                authorId: user.id,
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        // Create notification for the post author
        const post = await db.post.findUnique({
            where: { id: postId },
            include: { author: true },
        });

        if (post && post.authorId !== user.id) {
            await createNotification({
                type: 'COMMENT',
                recipientId: post.authorId,
                senderId: user.id,
                postId: postId,
                commentId: comment.id,
                message: `${user.name || 'Someone'} commented on your post "${post.title}"`,
            });
        }

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { commentId, content } = body;

        if (!commentId || !content) {
            return NextResponse.json({ error: 'Missing commentId or content' }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if comment exists and user owns it
        const existingComment = await db.comment.findUnique({
            where: { id: commentId },
            include: { author: true },
        });

        if (!existingComment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        if (existingComment.authorId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const updatedComment = await db.comment.update({
            where: { id: commentId },
            data: { content },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const commentId = searchParams.get('commentId');

        if (!commentId) {
            return NextResponse.json({ error: 'Missing commentId' }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if comment exists and user owns it
        const existingComment = await db.comment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        if (existingComment.authorId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await db.comment.delete({
            where: { id: commentId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
