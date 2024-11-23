import { NextRequest, NextResponse } from 'next/server';
import { withDb } from '@/lib/mongodb';

interface ScoreDoc {
  name: string;
  wpm: number;
  accuracy?: number;
  createdAt: Date;
}

export async function GET() {
  try {
    const scores = await withDb(async (db) => {
      return db
        .collection<ScoreDoc>('scores')
        .find({}, { projection: { _id: 0 } })
        .sort({ wpm: -1 })
        .limit(20)
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
    const body = await req.json();
    const { name, wpm, accuracy } = body;
    if (!name || typeof name !== 'string' || !wpm || typeof wpm !== 'number') {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    await withDb(async (db) => {
      await db.collection<ScoreDoc>('scores').insertOne({
        name: name.slice(0, 32),
        wpm,
        accuracy,
        createdAt: new Date()
      });
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
