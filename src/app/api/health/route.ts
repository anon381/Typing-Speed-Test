import { NextResponse } from 'next/server';
import { pingDb } from '@/lib/mongodb';

export async function GET() {
  const dbStatus = await pingDb();
  return NextResponse.json({ ok: true, db: dbStatus });
}
