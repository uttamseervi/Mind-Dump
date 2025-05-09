import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const query = searchParams.get('query');
    const take = Number(searchParams.get('take') || '10');
    const skip = Number(searchParams.get('skip') || '0');
    
    const whereClause: any = {
      published: true,
    };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (tag) {
      whereClause.tags = {
        has: tag,
      };
    }
    
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }
    
    const posts = await db.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    });
    
    const total = await db.post.count({
      where: whereClause,
    });
    
    return NextResponse.json({
      posts,
      total,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { title, content, image, category, tags, published } = body;
    
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate a slug from the title
    let slug = slugify(title, { lower: true });
    
    // Check if slug already exists
    const slugExists = await db.post.findUnique({
      where: { slug },
    });
    
    // If slug exists, append a unique string
    if (slugExists) {
      slug = `${slug}-${Date.now().toString().slice(-6)}`;
    }
    
    const post = await db.post.create({
      data: {
        title,
        slug,
        content,
        image,
        category,
        tags: tags || [],
        published,
        authorId: user.id,
      },
    });
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}