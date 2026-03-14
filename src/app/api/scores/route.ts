
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const db = await getDb();
    const scores = await db
      .collection('scores')
      .find(
        {
          email: { $exists: true, $ne: null },
          wpm: { $type: 'number' },
          accuracy: { $type: 'number' },
          errors: { $type: 'number' },
          finishSeconds: { $type: 'number' },
        },
        {
          projection: {
            _id: 0,
            name: 1,
            wpm: 1,
            accuracy: 1,
            errors: 1,
            finishSeconds: 1,
            createdAt: 1,
            passageId: 1,
          },
        }
      )
      .sort({ wpm: -1, accuracy: -1, errors: 1, finishSeconds: 1, createdAt: -1 })
      .limit(7)
      .toArray();

    return NextResponse.json({ ok: true, scores });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const auth = req.headers.get('authorization');
    let token: string | undefined;
    if (auth?.startsWith('Bearer ')) {
      token = auth.slice(7);
    } else {
      token = req.cookies.get('token')?.value;
    }
    if(!token) return NextResponse.json({ ok:false, error:'Missing token' }, { status:401 });
    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret)
      return NextResponse.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
    interface JwtPayloadSub { sub?: string }
    let email: string | undefined;
    try {
      const payload = jwt.verify(token, secret) as JwtPayloadSub | string;
      email = typeof payload === 'string' ? undefined : payload.sub;
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 });
    }
    if(!email) return NextResponse.json({ ok:false, error:'Invalid token payload' }, { status:401 });

    const user = await db.collection('users').findOne(
      { email },
      { projection: { _id: 0, name: 1, email: 1 } }
    );
    const displayName = typeof user?.name === 'string' && user.name.trim().length > 0 ? user.name.trim() : email;

    const body = await req.json();
    const { wpm, accuracy, errors, finishSeconds, passageId } = body as {
      wpm?: unknown;
      accuracy?: unknown;
      errors?: unknown;
      finishSeconds?: unknown;
      passageId?: unknown;
    };

    const parsedWpm = typeof wpm === 'number' ? wpm : Number.NaN;
    const parsedAccuracy = typeof accuracy === 'number' ? accuracy : Number.NaN;
    const parsedErrors = typeof errors === 'number' ? errors : Number.NaN;
    const parsedFinishSeconds = typeof finishSeconds === 'number' ? finishSeconds : Number.NaN;

    if (
      !Number.isFinite(parsedWpm) ||
      parsedWpm < 0 ||
      !Number.isFinite(parsedErrors) ||
      parsedErrors < 0 ||
      !Number.isFinite(parsedFinishSeconds) ||
      parsedFinishSeconds <= 0 ||
      typeof passageId !== 'string' ||
      passageId.trim().length === 0 ||
      !Number.isFinite(parsedAccuracy) ||
      parsedAccuracy < 0 ||
      parsedAccuracy > 100
    ) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    const recent = await db.collection('scores').findOne(
      {
        email,
        updatedAt: { $gt: new Date(Date.now() - 5_000) },
      },
      { sort: { updatedAt: -1 } }
    );

    if (recent) {
      return NextResponse.json({ ok: false, error: 'Please wait before submitting again' }, { status: 429 });
    }

    const roundedWpm = Math.round(parsedWpm);
    const roundedAccuracy = Math.round(parsedAccuracy);
    const roundedErrors = Math.round(parsedErrors);
    const roundedFinishSeconds = Math.round(parsedFinishSeconds);
    const existing = await db.collection('scores').findOne(
      { email },
      {
        projection: {
          _id: 1,
          wpm: 1,
          accuracy: 1,
          errors: 1,
          finishSeconds: 1,
        },
      }
    );

    const isBetterThanExisting = (() => {
      if (!existing) return true;
      const exWpm = typeof existing.wpm === 'number' ? existing.wpm : -1;
      const exAcc = typeof existing.accuracy === 'number' ? existing.accuracy : -1;
      const exErr = typeof existing.errors === 'number' ? existing.errors : Number.MAX_SAFE_INTEGER;
      const exFinish = typeof existing.finishSeconds === 'number' ? existing.finishSeconds : Number.MAX_SAFE_INTEGER;

      if (roundedWpm !== exWpm) return roundedWpm > exWpm;
      if (roundedAccuracy !== exAcc) return roundedAccuracy > exAcc;
      if (roundedErrors !== exErr) return roundedErrors < exErr;
      return roundedFinishSeconds < exFinish;
    })();

    if (existing && !isBetterThanExisting) {
      return NextResponse.json({ ok: true, updated: false });
    }

    await db.collection('scores').updateOne(
      { email },
      {
        $set: {
          email,
          name: displayName,
          wpm: roundedWpm,
          accuracy: roundedAccuracy,
          errors: roundedErrors,
          finishSeconds: roundedFinishSeconds,
          passageId: passageId.trim(),
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, updated: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
