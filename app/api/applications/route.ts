import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { ApplicationRow, normalizeApplication, runOptionalDbTask } from '../../../src/lib/db';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || '';
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const { rows } = await sql<ApplicationRow>`
      SELECT * FROM applications WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return NextResponse.json({ applications: rows.map(normalizeApplication) });
  } catch (error) {
    return sendError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, petId, payload } = body || {};
    if (!userId || !petId) {
      return NextResponse.json({ error: 'userId and petId are required' }, { status: 400 });
    }

    const { rows } = await sql<ApplicationRow>`
      INSERT INTO applications (user_id, pet_id, status, date, payload)
      VALUES (${userId}, ${petId}, '正在审核', '刚刚', ${JSON.stringify(payload || {})}::jsonb)
      RETURNING *
    `;
    await runOptionalDbTask(
      async () => {
        await sql`
          INSERT INTO notifications (user_id, category, title, body, image, action_label, action_url, status, metadata)
          VALUES (${userId}, '申请', '领养申请已提交', '你的申请已经进入审核流程，可以在个人主页查看最新进度。',
                  '', '查看进度', '/profile', 'unread', ${JSON.stringify({ petId })}::jsonb)
        `;
      },
      'Application notification'
    );
    return NextResponse.json({ application: normalizeApplication(rows[0]) });
  } catch (error) {
    return sendError(error);
  }
}
