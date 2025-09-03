import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('🔍 Fetching featured interviews and companies...');
        
        // Test database connection first
        await db.$queryRaw`SELECT 1`;
        
        // Fetch both interviews and companies in parallel
        const [featuredInterviews, companies] = await Promise.all([
            // Get featured interviews
            db.post.findMany({
                where: { published: true },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    description: true,
                    companyName: true,
                    difficulty: true,
                    category: true,
                    slug: true,
                    createdAt: true,
                    author: {
                        select: { 
                            name: true, 
                            image: true 
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 6,
            }),
            
            // Get companies
            db.post.groupBy({
                by: ['companyName'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 6,
            })
        ]);

        console.log(`✅ Fetched ${featuredInterviews.length} interviews and ${companies.length} companies`);

        return NextResponse.json({
            interviews: featuredInterviews || [],
            companies: companies.map(company => ({
                name: company.companyName,
                count: company._count.id,
            })) || [],
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        console.error('❌ Error in featured-interviews API:', {
            error: errorMessage,
            stack: errorStack,
            env: process.env.NODE_ENV,
            dbUrl: process.env.DATABASE_URL ? 'Database URL is set' : 'Database URL is NOT set'
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch featured interviews',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}
