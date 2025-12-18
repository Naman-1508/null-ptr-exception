import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const publicDir = path.join(process.cwd(), 'public');
    let files: string[] = [];

    try {
        files = fs.readdirSync(publicDir).filter(file => file.endsWith('.txt'));
    } catch (e) {
        console.error('Error reading public dir:', e);
    }

    const userAgent = request.headers.get('user-agent') || '';
    if (userAgent.toLowerCase().includes('curl')) {
        return new Response(files.join('\n'), {
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    return NextResponse.json({ files });
}
