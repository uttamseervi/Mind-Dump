import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Get unique company names from posts
        const companies = await db.post.groupBy({
            by: ['companyName'],
            where: {
                AND: [
                    { companyName: { not: null } },
                    { companyName: { not: '' } }, // Exclude empty strings
                    { companyName: { not: 'undefined' } }, // Exclude 'undefined' strings
                ],
                published: true, // Only include published posts
            },
            _count: {
                _all: true,
            },
            orderBy: {
                companyName: 'asc',
            },
        });

        // Filter out any remaining invalid company names (just in case)
        const validCompanies = companies.filter(company => 
            company.companyName && 
            company.companyName.trim() !== '' && 
            company._count._all > 0
        );

        return NextResponse.json(validCompanies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        return NextResponse.json(
            { error: 'Failed to fetch companies. Please try again later.' },
            { status: 500 }
        );
    }
}
