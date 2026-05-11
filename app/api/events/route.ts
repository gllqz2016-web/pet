import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { EventRow, normalizeEvent } from '../../../src/lib/db';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') || '';
    let rows: EventRow[];
    if (category && category !== '全部') {
      ({ rows } = await sql<EventRow>`SELECT * FROM events WHERE category = ${category} ORDER BY starts_at ASC`);
    } else {
      ({ rows } = await sql<EventRow>`SELECT * FROM events ORDER BY starts_at ASC`);
    }
    return NextResponse.json({ events: rows.map(normalizeEvent) });
  } catch (error) {
    return sendError(error);
  }
}
