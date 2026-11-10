import { NextResponse } from 'next/server';
import { dispatchUserMessage } from '@/lib/agent';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: { userId?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ reply: 'Could not read your message.' }, { status: 400 });
  }
  const userId = body.userId || 'anon';
  const message = (body.message || '').trim();
  if (!message) return NextResponse.json({ reply: 'Type a message to get started.' }, { status: 400 });
  try {
    const result = await dispatchUserMessage(message, userId);
    return NextResponse.json({ reply: result.reply, escalate: result.escalate, summary: result.summary });
  } catch (err) {
    return NextResponse.json(
      { reply: `The assistant hit a snag: ${err instanceof Error ? err.message : 'unexpected error'}`, escalate: true },
      { status: 500 },
    );
  }
}
