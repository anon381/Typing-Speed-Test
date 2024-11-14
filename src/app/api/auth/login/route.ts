import { NextRequest, NextResponse } from 'next/server';
import { withDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface UserDoc { username: string; passwordHash: string; createdAt: Date; }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    const norm = username.trim().toLowerCase();
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) return NextResponse.json({ ok: false, error: 'Missing AUTH_JWT_SECRET' }, { status: 500 });

    const user = await withDb(async (db) => db.collection<UserDoc>('users').findOne({ username: norm }));
    if (!user) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });

    const token = jwt.sign({ sub: user.username }, secret, { expiresIn: '2h' });
    return NextResponse.json({ ok: true, token });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
