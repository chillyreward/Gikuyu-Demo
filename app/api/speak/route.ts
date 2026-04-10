import { NextResponse } from 'next/server';
import { synthesizeSpeech } from '@/lib/elevenlabs';
import { synthesizeWithOpenAI } from '@/lib/openaiTTS';
import { synthesizeWithGooey } from '@/lib/gooeyTTS';

export async function POST(request: Request) {
  try {
    const { text, engine, voice } = await request.json();

    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const gooeyKey = process.env.GOOEY_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';

    let audioBuffer: ArrayBuffer;

    if (engine === 'openai') {
      if (!openaiKey) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
      audioBuffer = await synthesizeWithOpenAI(text, openaiKey, voice ?? 'nova');
    } else if (engine === 'elevenlabs') {
      if (!elevenLabsKey) return NextResponse.json({ error: 'Missing ELEVENLABS_API_KEY' }, { status: 500 });
      audioBuffer = await synthesizeSpeech(text, elevenLabsKey, voiceId);
    } else {
      // Default: Gooey
      if (!gooeyKey) return NextResponse.json({ error: 'Missing GOOEY_API_KEY' }, { status: 500 });
      audioBuffer = await synthesizeWithGooey(text, gooeyKey);
    }

    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });

  } catch (error: any) {
    console.error('[Speak]', error.message);
    return NextResponse.json({ error: error.message || 'TTS failed' }, { status: 500 });
  }
}
