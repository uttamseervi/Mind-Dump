import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Get unique company names from posts
        const companies = await db.post.groupBy({
            by: ['companyName'],
            where: {
                companyName: {
                    not: null,
                },
            },
            _count: {
                _all: true,
            },
            orderBy: {
                companyName: 'asc',
            },
        });

        return NextResponse.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        return NextResponse.json(
            { error: 'Failed to fetch companies' },
            { status: 500 }
        );
    }
}
