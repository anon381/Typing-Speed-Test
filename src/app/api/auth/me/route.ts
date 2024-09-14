/**
 * GET /api/auth/me
 * Returns the authenticated user's public info (id, username, createdAt) if a valid JWT cookie is present.
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

interface JwtPayloadSub { sub?: string }
//
export async function GET(req: NextRequest) {
  try {
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) return NextResponse.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
  const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ ok: true, user: null });
    try {
      const payload = jwt.verify(token, secret) as JwtPayloadSub | string;
  const username = typeof payload === 'string' ? undefined : payload.sub;
  if (!username) return NextResponse.json({ ok: true, user: null });
  const user = await prisma.user.findUnique({ where: { username }, select: { id: true, username: true, createdAt: true } });
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
