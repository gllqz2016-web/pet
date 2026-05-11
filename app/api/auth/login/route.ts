import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateUser, normalizeUser } from '../../../../src/lib/db';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const user = await findOrCreateUser(body || {});
    return NextResponse.json({ user: normalizeUser(user) });
  } catch (error) {
    return sendError(error);
  }
}
