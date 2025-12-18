import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: Request,
    { params }: { params: { filename: string } }
) {
    const { filename } = params;
    const filePath = path.join(process.cwd(), 'public', filename);

    if (!fs.existsSync(filePath) || !filename.endsWith('.txt')) {
        return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
        headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}
