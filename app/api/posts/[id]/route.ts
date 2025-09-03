import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to view this post
    const session = await getServerSession(authOptions);
    if (!post.published && (!session?.user || post.author.id !== session.user.id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const post = await db.post.findUnique({
      where: { id: params.id },
      include: {
        author: true,
      },
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    if (post.author.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { 
      title, 
      content, 
      description, 
      companyName, 
      difficulty, 
      category, 
      tags, 
      published 
    } = body;
    
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Only update slug if title has changed
    let updateData: any = {
      title,
      content,
      description,
      companyName,
      difficulty,
      category,
      tags: tags || [],
      published,
    };
    
    if (title !== post.title) {
      let slug = slugify(title, { lower: true });
      
      // Check if slug already exists and is not this post
      const slugExists = await db.post.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });
      
      // If slug exists, append a unique string
      if (slugExists) {
        slug = `${slug}-${Date.now().toString().slice(-6)}`;
      }
      
      updateData.slug = slug;
    }
    
    const updatedPost = await db.post.update({
      where: { id: params.id },
      data: updateData,
    });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const post = await db.post.findUnique({
      where: { id: params.id },
      include: {
        author: true,
      },
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    if (post.author.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await db.post.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}