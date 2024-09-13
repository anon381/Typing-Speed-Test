/**
 * POST /api/auth/logout
 * Clears the auth JWT cookie to terminate the session.
 */
import { NextResponse } from 'next/server';
//
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: 'token', value: '', httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
