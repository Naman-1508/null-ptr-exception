import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';
    const url = request.nextUrl.clone();

    // If it's a curl request to the home page, redirect/rewrite to the list API
    if (url.pathname === '/' && userAgent.toLowerCase().includes('curl')) {
        // We rewrite to /api/list so the user gets the plain text list
        url.pathname = '/api/list';
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

// Only run on the home page to keep it fast
export const config = {
    matcher: '/',
};
