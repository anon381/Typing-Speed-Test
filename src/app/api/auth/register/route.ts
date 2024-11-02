import { NextRequest, NextResponse } from 'next/server';
import { withDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// NOTE: In production you might add rate limiting / captcha to this route.
interface UserDoc { username: string; passwordHash: string; createdAt: Date; }

export async function POST(req: NextRequest) {
  try {
  const body = await req.json();
  if(!body || typeof body !== 'object') return NextResponse.json({ ok:false, error:'Invalid body'}, { status:400 });
  const { username, password } = body as { username?: unknown; password?: unknown };
    if (typeof username !== 'string' || typeof password !== 'string' || username.length < 3 || password.length < 6) {
      return NextResponse.json({ ok: false, error: 'Invalid username or password length' }, { status: 400 });
    }
    const norm = username.trim().toLowerCase();
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) return NextResponse.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });

  await withDb(async (db) => {
      const existing = await db.collection<UserDoc>('users').findOne({ username: norm });
      if (existing) throw new Error('Username already taken');
      const passwordHash = await bcrypt.hash(password, 10);
      await db.collection<UserDoc>('users').insertOne({ username: norm, passwordHash, createdAt: new Date() });
    });

    // Auto-login after successful registration
    const token = jwt.sign({ sub: norm }, secret, { expiresIn: '2h' });
    const res = NextResponse.json({ ok: true });
    res.cookies.set({ name: 'token', value: token, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 2 });
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
