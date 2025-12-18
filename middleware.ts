import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';
    const url = request.nextUrl.clone();

    // 1. If it's a curl request to the home page, redirect/rewrite to the list API
    if (url.pathname === '/' && userAgent.toLowerCase().includes('curl')) {
        url.pathname = '/api/list';
        return NextResponse.rewrite(url);
    }

    // 2. If it's a request for a .txt file, rewrite it to our download API
    // This ensures Vercel serves it correctly even if static serving is picky
    if (url.pathname.endsWith('.txt')) {
        const filename = url.pathname.slice(1); // remove leading slash
        // Check if it's already an API call to avoid loops
        if (!url.pathname.startsWith('/api/')) {
            url.pathname = `/api/download/${filename}`;
            return NextResponse.rewrite(url);
        }
    }

    return NextResponse.next();
}

// Only run on the home page and txt files to keep it fast
export const config = {
    matcher: ['/', '/:path*.txt'],
};
