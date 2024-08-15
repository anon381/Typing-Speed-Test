
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    const scores = await prisma.score.findMany({
      take: 50,
      orderBy: { wpm: 'desc' },
      select: { name: true, wpm: true, accuracy: true, createdAt: true, passageId: true }
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

    const recent = await prisma.score.findFirst({
      where: { name: username!, createdAt: { gt: new Date(Date.now() - 5_000) } },
      orderBy: { createdAt: 'desc' }
    });
    if (recent) throw new Error('Please wait before submitting again');
    await prisma.score.create({ data: { name: username!, wpm, accuracy, passageId } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
