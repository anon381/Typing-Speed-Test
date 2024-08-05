
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface UserDoc { username: string; passwordHash: string; createdAt: Date; }

export async function POST(req: NextRequest) {
  try {
  const body = await req.json();
  if(!body || typeof body !== 'object') return NextResponse.json({ ok:false, error:'Invalid body' }, { status:400 });
  const { username, password } = body as { username?: unknown; password?: unknown };
    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    const norm = username.trim().toLowerCase();
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) return NextResponse.json({ ok: false, error: 'Missing AUTH_JWT_SECRET' }, { status: 500 });

  const user = await prisma.user.findUnique({ where: { username: norm } });
    if (!user) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });

  const token = jwt.sign({ sub: user.username }, secret, { expiresIn: '2h' });
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: 'token', value: token, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 2 });
  return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
