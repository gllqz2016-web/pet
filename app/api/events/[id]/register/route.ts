import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { runOptionalDbTask } from '../../../../../src/lib/db';

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

    const { rows } = await sql<{ id: string; user_id: string; event_id: string }>`
      INSERT INTO event_registrations (user_id, event_id)
      VALUES (${userId}, ${id})
      ON CONFLICT (user_id, event_id) DO UPDATE SET user_id = EXCLUDED.user_id
      RETURNING *
    `;
    await runOptionalDbTask(
      async () => {
        await sql`
          INSERT INTO notifications (user_id, category, title, body, image, action_label, action_url, status, metadata)
          VALUES (${userId}, '活动', '活动报名成功', '你已成功报名活动，请在活动开始前留意通知。',
                  '', '查看活动', ${`/events/${id}`}, 'unread', ${JSON.stringify({ eventId: id })}::jsonb)
        `;
      },
      'Event registration notification'
    );
    return NextResponse.json({ registration: rows[0] });
  } catch (error) {
    return sendError(error);
  }
}
