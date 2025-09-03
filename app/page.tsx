'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Clock, Briefcase, User, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Interview {
  id: string;
  title: string;
  content?: string | null;
  description?: string | null;
  companyName?: string | null;
  difficulty?: string | null;
  category?: string | null;
  slug: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface Company {
  name: string;
  count: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/featured-interviews', {
          next: { revalidate: 60 } // Revalidate every 60 seconds
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        
        const data = await response.json();
        
        if (!data.interviews || !data.companies) {
          throw new Error('Invalid data received from server');
        }
        
        setInterviews(data.interviews);
        setCompanies(data.companies);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        console.error('Error in fetchData:', {
          error: errorMessage,
          stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
        });
        
        setError(errorMessage);
        
        // Set empty arrays to prevent UI errors
        setInterviews([]);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, []);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Ace Your Next Interview
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Learn from real interview experiences at top tech companies. Get insights into the interview process, questions, and tips from candidates who've been there.
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for companies, roles, or topics..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="mt-4 w-full md:w-auto" asChild>
            <Link href={`/interviews?query=${encodeURIComponent(searchQuery)}`}>
              Search Interviews
            </Link>
          </Button>
        </div>
      </section>

      {/* Popular Companies */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {companies.map((company) => (
            <Link 
              key={company.name} 
              href={`/interviews/company/${encodeURIComponent(company.name)}`}
              className="group"
            >
              <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-bold text-primary">
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-medium text-center">{company.name}</h3>
                <p className="text-sm text-muted-foreground">{company.count} interviews</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Interviews */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Interviews</h2>
          <Button variant="outline" asChild>
            <Link href="/interviews">View All</Link>
          </Button>
        </div>

        <div className="space-y-6">
          {interviews.map((interview) => (
            <div 
              key={interview.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/interviews/${interview.slug}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{interview.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        {interview.companyName && (
                          <>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {interview.companyName}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {interview.category || 'Interview'}
                        </span> 
                      </div>
                    </div>
                    {interview.difficulty && (
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          interview.difficulty.toLowerCase() === 'easy' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30' 
                            : interview.difficulty.toLowerCase() === 'medium' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30'
                        }`}
                      >
                        {interview.difficulty}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground line-clamp-3">
                    {interview.content 
                      ? `${interview.content.substring(0, 200)}${interview.content.length > 200 ? '...' : ''}`
                      : interview.description || 'No content available.'
                    }
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{interview.author?.name || 'Anonymous'}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(interview.createdAt)}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Read More
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center bg-muted/50 rounded-xl my-12">
        <div className="max-w-2xl mx-auto px-4">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Share Your Interview Experience</h2>
          <p className="text-muted-foreground mb-8">
            Help others by sharing your interview experience. Your insights could be the key to someone else's success.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard/post/new">Share Your Story</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}