import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
        }

        const likeCount = await db.like.count({
            where: { postId },
        });

        return NextResponse.json({ postId, likeCount });
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
