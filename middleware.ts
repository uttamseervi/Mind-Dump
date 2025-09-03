import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // If there's a token, the user is authenticated
                return !!token;
            },
        },
        pages: {
            signIn: '/login', // Redirect to login page if not authenticated
        },
    }
);

// Configure which routes should be protected
export const config = {
    matcher: [
        '/dashboard/:path*',
        // '/api/posts/:path*',
    ],
};
