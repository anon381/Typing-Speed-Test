import { NextResponse } from 'next/server';
import { pingDb, prisma } from '@/lib/prisma';

export async function GET() {
  const dbStatus = await pingDb();
  let meta: any = undefined;
  if (dbStatus.ok) {
    try {
      const [users, scores] = await Promise.all([
        prisma.user.count(),
        prisma.score.count()
      ]);
      meta = { users, scores };
    } catch (e: any) {
      meta = { error: e.message };
    }
  }
  return NextResponse.json({ ok: true, db: dbStatus, meta });
}
