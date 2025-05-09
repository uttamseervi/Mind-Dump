// app/api/register/route.ts

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import slugify from 'slugify';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate slugified username
    let username = slugify(name, { lower: true });

    // Check if username already exists
    const usernameExists = await db.user.findUnique({
      where: { email },
    });

    // Append timestamp to make username unique if needed
    if (usernameExists) {
      username = `${username}-${Date.now().toString().slice(-6)}`;
    }

    // Create the user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
