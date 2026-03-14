
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
  const db = await getDb();
  const body = await req.json();
  if(!body || typeof body !== 'object') return NextResponse.json({ ok:false, error:'Invalid body' }, { status:400 });
  const { email, password } = body as { email?: unknown; password?: unknown };
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    const normEmail = email.trim().toLowerCase();
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) return NextResponse.json({ ok: false, error: 'Missing AUTH_JWT_SECRET' }, { status: 500 });

  const user = await db.collection('users').findOne({ email: normEmail });
    if (!user) return NextResponse.json({ ok: false, error: 'Email not found' }, { status: 401 });
    const passwordHash = typeof user.passwordHash === 'string' ? user.passwordHash : '';
    const match = await bcrypt.compare(password, passwordHash);
    if (!match) return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  const token = jwt.sign({ sub: user.email }, secret, { expiresIn: '2h' });
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: 'token', value: token, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 2 });
  return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
