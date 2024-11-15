import { NextRequest, NextResponse } from 'next/server';
import { withDb } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

interface ScoreDoc {
  name: string;
  wpm: number;
  accuracy?: number;
  createdAt: Date;
  passageId: string;
}

export async function GET() {
  try {
    const scores = await withDb(async (db) => {
      return db
        .collection<ScoreDoc>('scores')
        .find({}, { projection: { _id: 0 } })
        .sort({ wpm: -1 })
        .limit(50)
        .toArray();
    });
    return NextResponse.json({ ok: true, scores });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer '))
      return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 401 });
    const token = auth.slice(7);
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret)
      return NextResponse.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
    interface JwtPayloadSub { sub?: string }
    let username: string | undefined;
    try {
      const payload = jwt.verify(token, secret) as JwtPayloadSub | string;
      username = typeof payload === 'string' ? undefined : payload.sub;
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 });
    }
    if(!username) return NextResponse.json({ ok:false, error:'Invalid token payload' }, { status:401 });

    const body = await req.json();
    const { wpm, accuracy, passageId } = body;
    if (!wpm || typeof wpm !== 'number' || !passageId) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    await withDb(async (db) => {
      const recent = await db
        .collection<ScoreDoc>('scores')
        .findOne({ name: username!, createdAt: { $gt: new Date(Date.now() - 5_000) } });
      if (recent) throw new Error('Please wait before submitting again');
      await db.collection<ScoreDoc>('scores').insertOne({ name: username!, wpm, accuracy, passageId, createdAt: new Date() });
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
