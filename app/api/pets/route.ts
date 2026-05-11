import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { PetRow } from '../../../src/lib/db';

function sendError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  console.error(message);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET() {
  try {
    const { rows: pets } = await sql<PetRow>`SELECT * FROM pets ORDER BY created_at ASC`;
    return NextResponse.json({ pets });
  } catch (error) {
    return sendError(error);
  }
}
