/**
 * POST /api/auth/register
 * ------------------------
 * Handles user registration.
 *
 * Steps:
 * 1. Validates request body and username/password rules.
 * 2. Normalizes username to lowercase and trims whitespace.
 * 3. Checks if username is already taken in MongoDB.
 * 4. Hashes password with bcrypt and creates the user document.
 * 5. Issues a JWT token (2h expiry) and sets it as an HttpOnly cookie.
 * 6. Returns `{ ok: true }` on success, or error details if validation fails.
 *
 * Usage:
 * Call this endpoint to register a new user and automatically log them in.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
  const body = await req.json();
  if(!body || typeof body !== 'object') return NextResponse.json({ ok:false, error:'Invalid body'}, { status:400 });
  const { name, email, password, retype } = body as { name?: unknown; email?: unknown; password?: unknown; retype?: unknown };
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof retype !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }
    const normEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail)) return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ ok: false, error: 'Password too short' }, { status: 400 });
    if (password !== retype) return NextResponse.json({ ok: false, error: 'Passwords do not match' }, { status: 400 });
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) return NextResponse.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  const existing = await db.collection('users').findOne({ email: normEmail });
  if (existing) throw new Error('Email already registered');
  const passwordHash = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({ name: name.trim(), email: normEmail, passwordHash, createdAt: new Date() });

    const token = jwt.sign({ sub: normEmail }, secret, { expiresIn: '2h' });
    const res = NextResponse.json({ ok: true });
    res.cookies.set({ name: 'token', value: token, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 2 });
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
