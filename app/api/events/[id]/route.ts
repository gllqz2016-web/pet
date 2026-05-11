import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { EventRow, normalizeEvent } from '../../../../src/lib/db';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { rows } = await sql<EventRow>`SELECT * FROM events WHERE id = ${id} LIMIT 1`;
    if (!rows[0]) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event: normalizeEvent(rows[0]) });
  } catch (error) {
    return sendError(error);
  }
}
