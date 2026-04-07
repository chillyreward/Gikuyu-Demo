import { NextResponse } from 'next/server';
import { synthesizeSpeech } from '@/lib/elevenlabs';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing ELEVENLABS_API_KEY in .env.local. Using browser speech instead.' },
        { status: 500 }
      );
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
    const audioBuffer = await synthesizeSpeech(text, apiKey, voiceId);

    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });

  } catch (error: any) {
    console.error('[Speak]', error.message);
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}
