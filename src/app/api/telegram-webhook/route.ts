// app/api/telegram-webhook/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    console.log('✅ Telegram Webhook Payload:', body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('❌ Error in Telegram Webhook:', error);
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
