import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Get featured interviews (most recent 6 published posts)
        const featuredInterviews = await db.post.findMany({
            where: {
                published: true,
            },
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
            take: 6,
        });

        // Get unique companies for the search section
        const companies = await db.post.groupBy({
            by: ['companyName'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 6,
        });

        return NextResponse.json({
            interviews: featuredInterviews,
            companies: companies.map(company => ({
                name: company.companyName,
                count: company._count.id,
            })),
        });
    } catch (error) {
        console.error('Error fetching featured interviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch featured interviews' },
            { status: 500 }
        );
    }
}
