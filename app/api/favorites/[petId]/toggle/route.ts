import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    const { petId } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = String(body?.userId || '');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const { rows: existing } = await sql`
      SELECT pet_id FROM favorites WHERE user_id = ${userId} AND pet_id = ${petId} LIMIT 1
    `;
    if (existing[0]) {
      await sql`DELETE FROM favorites WHERE user_id = ${userId} AND pet_id = ${petId}`;
    } else {
      await sql`INSERT INTO favorites (user_id, pet_id) VALUES (${userId}, ${petId})`;
    }

    const { rows } = await sql<{ pet_id: string }>`
      SELECT pet_id FROM favorites WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return NextResponse.json({ favorites: rows.map((row) => row.pet_id) });
  } catch (error) {
    return sendError(error);
  }
}
