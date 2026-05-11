import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { NotificationRow, normalizeNotification } from '../../../../../src/lib/db';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = String(body?.userId || '');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const { rows } = await sql<NotificationRow>`
      UPDATE notifications SET status = 'archived'
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;
    if (!rows[0]) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    return NextResponse.json({ notification: normalizeNotification(rows[0]) });
  } catch (error) {
    return sendError(error);
  }
}
