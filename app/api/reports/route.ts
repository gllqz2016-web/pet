import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { ReportRow, normalizeReport, runOptionalDbTask } from '../../../src/lib/db';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const filter = request.nextUrl.searchParams.get('filter') || '';
    let rows: ReportRow[];
    if (filter === '丢失宠物') {
      ({ rows } = await sql<ReportRow>`SELECT * FROM reports WHERE report_type = '丢失' ORDER BY created_at DESC`);
    } else if (filter === '最新目击') {
      ({ rows } = await sql<ReportRow>`SELECT * FROM reports WHERE report_type = '目击' ORDER BY created_at DESC`);
    } else if (filter === '重聚故事') {
      ({ rows } = await sql<ReportRow>`SELECT * FROM reports WHERE report_type = '已团聚' ORDER BY created_at DESC`);
    } else {
      ({ rows } = await sql<ReportRow>`SELECT * FROM reports ORDER BY created_at DESC`);
    }
    return NextResponse.json({ reports: rows.map(normalizeReport) });
  } catch (error) {
    return sendError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, title, reportType, species, location, happenedAt, description, image, reward } = body || {};
    if (!title || !reportType || !location) {
      return NextResponse.json({ error: 'title, reportType and location are required' }, { status: 400 });
    }

    const { rows } = await sql<ReportRow>`
      INSERT INTO reports (user_id, title, report_type, species, location, happened_at, description, image, reward, status)
      VALUES (
        ${userId || null}, ${title}, ${reportType}, ${species || ''}, ${location},
        ${happenedAt || new Date().toISOString()}, ${description || ''}, ${image || ''},
        ${reward ? Number(reward) : null},
        ${reportType === '已团聚' ? 'resolved' : 'open'}
      )
      RETURNING *
    `;

    if (userId) {
      await runOptionalDbTask(
        async () => {
          await sql`
            INSERT INTO notifications (user_id, category, title, body, image, action_label, action_url, status, metadata)
            VALUES (
              ${userId},
              ${reportType === '目击' ? '目击' : '进度'},
              '报告已发布',
              ${`${title} 的${reportType}信息已经同步到附近动态。`},
              ${image || ''}, '查看报告', ${`/reports/${rows[0].id}`}, 'unread',
              ${JSON.stringify({ reportId: rows[0].id })}::jsonb
            )
          `;
        },
        'Report notification'
      );
    }

    return NextResponse.json({ report: normalizeReport(rows[0]) });
  } catch (error) {
    return sendError(error);
  }
}
