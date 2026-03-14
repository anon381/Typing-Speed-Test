
import { NextResponse } from 'next/server';
import { getDb, pingDb } from '@/lib/mongodb';
// Health check
export async function GET() {
  const dbStatus = await pingDb();
  let meta: unknown = undefined;
  if (dbStatus.ok) {
    try {
      const db = await getDb();
      const [users, scores] = await Promise.all([
        db.collection('users').countDocuments(),
        db.collection('scores').countDocuments(),
      ]);
      meta = { users, scores };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      meta = { error: message };
    }
  }
  return NextResponse.json({ ok: true, db: dbStatus, meta });
}
