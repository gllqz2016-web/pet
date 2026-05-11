import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { NotificationRow, normalizeNotification, ensureNotificationPreferences, ensureSeedNotifications } from '../../../src/lib/db';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || '';
    const status = request.nextUrl.searchParams.get('status') || 'unread';
    const category = request.nextUrl.searchParams.get('category') || '';
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    await ensureNotificationPreferences(userId);
    await ensureSeedNotifications(userId);

    let rows: NotificationRow[];
    const hasCategory = category && category !== '全部';
    const hasStatus = status !== 'all';

    if (hasStatus && hasCategory) {
      ({ rows } = await sql<NotificationRow>`
        SELECT * FROM notifications WHERE user_id = ${userId} AND status = ${status} AND category = ${category} ORDER BY created_at DESC
      `);
    } else if (hasStatus) {
      ({ rows } = await sql<NotificationRow>`
        SELECT * FROM notifications WHERE user_id = ${userId} AND status = ${status} ORDER BY created_at DESC
      `);
    } else if (hasCategory) {
      ({ rows } = await sql<NotificationRow>`
        SELECT * FROM notifications WHERE user_id = ${userId} AND category = ${category} ORDER BY created_at DESC
      `);
    } else {
      ({ rows } = await sql<NotificationRow>`
        SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC
      `);
    }

    return NextResponse.json({ notifications: rows.map(normalizeNotification) });
  } catch (error) {
    return sendError(error);
  }
}
