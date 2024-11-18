import { NextRequest, NextResponse } from 'next/server';
import { withDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
// NOTE: In production you might add rate limiting / captcha to this route.
interface UserDoc { username: string; passwordHash: string; createdAt: Date; }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    if (typeof username !== 'string' || typeof password !== 'string' || username.length < 3 || password.length < 6) {
      return NextResponse.json({ ok: false, error: 'Invalid username or password length' }, { status: 400 });
    }
    const norm = username.trim().toLowerCase();
    await withDb(async (db) => {
      const existing = await db.collection<UserDoc>('users').findOne({ username: norm });
      if (existing) throw new Error('Username already taken');
      const passwordHash = await bcrypt.hash(password, 10);
      await db.collection<UserDoc>('users').insertOne({ username: norm, passwordHash, createdAt: new Date() });
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
