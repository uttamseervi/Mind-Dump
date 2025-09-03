import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyInterviewsPageProps {
    params: { companyName: string };
}

export default async function CompanyInterviewsPage({
    params,
}: CompanyInterviewsPageProps) {
    // Decode the company name from the URL
    const companyName = decodeURIComponent(params.companyName);

    // Fetch interviews for this company
    const interviews = await db.post.findMany({
        where: {
            companyName: companyName,
        },
        include: {
            author: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (!interviews || interviews.length === 0) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/companies">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Companies
                    </Link>
                </Button>

                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-3xl font-bold text-primary">
                        {companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{companyName}</h1>
                        <p className="text-muted-foreground">
                            {interviews.length} {interviews.length === 1 ? 'interview' : 'interviews'} available
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {interviews.map((interview) => (
                    <Card key={interview.id} className="hover:shadow-md transition-shadow">
                        <Link href={`/interviews/${interview.slug}`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{interview.title}</CardTitle>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="secondary">{interview.category}</Badge>
                                            {interview.difficulty && (
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${interview.difficulty.toLowerCase() === 'easy'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30'
                                                            : interview.difficulty.toLowerCase() === 'medium'
                                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30'
                                                        }`}
                                                >
                                                    {interview.difficulty}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {format(new Date(interview.createdAt), 'MMM d, yyyy')}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {interview.description && (
                                    <p className="text-muted-foreground line-clamp-2">
                                        {interview.description}
                                    </p>
                                )}
                                <div className="mt-4 flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">By {interview.author.name}</span>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
}
