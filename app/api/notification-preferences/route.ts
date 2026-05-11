import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { NotificationPreferenceRow, normalizeNotificationPreferences, ensureNotificationPreferences } from '../../../src/lib/db';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || '';
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    await ensureNotificationPreferences(userId);
    const { rows } = await sql<NotificationPreferenceRow>`
      SELECT * FROM notification_preferences WHERE user_id = ${userId} LIMIT 1
    `;
    return NextResponse.json({ preferences: normalizeNotificationPreferences(rows[0]) });
  } catch (error) {
    return sendError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, adoptionUpdates, sightingReports } = body || {};
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const { rows } = await sql<NotificationPreferenceRow>`
      INSERT INTO notification_preferences (user_id, adoption_updates, sighting_reports, updated_at)
      VALUES (${userId}, ${Boolean(adoptionUpdates)}, ${Boolean(sightingReports)}, NOW())
      ON CONFLICT (user_id) DO UPDATE
        SET adoption_updates = EXCLUDED.adoption_updates,
            sighting_reports = EXCLUDED.sighting_reports,
            updated_at = NOW()
      RETURNING *
    `;
    return NextResponse.json({ preferences: normalizeNotificationPreferences(rows[0]) });
  } catch (error) {
    return sendError(error);
  }
}
