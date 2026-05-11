import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || '';
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const { rows } = await sql<{ pet_id: string }>`
      SELECT pet_id FROM favorites WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return NextResponse.json({ favorites: rows.map((row) => row.pet_id) });
  } catch (error) {
    return sendError(error);
  }
}
