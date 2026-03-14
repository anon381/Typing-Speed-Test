/**
 * GET /api/auth/me
 * -----------------
 * Returns the currently authenticated user based on the 'token' cookie.
 *
 * - Verifies JWT from cookie using server secret.
 * - Fetches user from MongoDB if token is valid.
 * - Returns `{ ok: true, user: userData | null }` or error if misconfigured.
 *
 * Usage:
 * Frontend can call this endpoint to check if a user is logged in.
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/mongodb';

interface JwtPayloadSub { sub?: string }
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) return NextResponse.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
  const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ ok: true, user: null });
    try {
      const payload = jwt.verify(token, secret) as JwtPayloadSub | string;
  const email = typeof payload === 'string' ? undefined : payload.sub;
  if (!email) return NextResponse.json({ ok: true, user: null });
  const user = await db.collection('users').findOne(
    { email },
    {
      projection: {
        _id: 0,
        name: 1,
        email: 1,
        createdAt: 1,
      },
    }
  );
  if (!user) return NextResponse.json({ ok: true, user: null });
  return NextResponse.json({ ok: true, user });
    } catch {
      return NextResponse.json({ ok: true, user: null });
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
