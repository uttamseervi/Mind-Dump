'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Company {
    companyName: string;
    _count: {
        _all: number;
    };
}

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('/api/companies');
                if (!response.ok) {
                    throw new Error('Failed to fetch companies');
                }
                const data = await response.json();
                setCompanies(data);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to load companies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Companies</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Companies</h1>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Companies</h1>

            {companies.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No companies found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {companies.map(({ companyName, _count }) => (
                        <motion.div
                            key={companyName}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ y: -5 }}
                        >
                            <Link href={`/interviews/company/${encodeURIComponent(companyName)}`}>
                                <Card className="h-full transition-all hover:shadow-md">
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
                                            <span className="text-2xl font-bold text-primary">
                                                {companyName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-center">{companyName}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {_count._all} {_count._all === 1 ? 'interview' : 'interviews'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
