import { NextRequest } from "next/server";
import { restructure, applyProsody, kikuyuPhonetic, splitChunks } from "@/lib/kikuyu";
import { ttsChunk } from "@/lib/elevenlabs";
import { localTranslate } from "@/lib/localTranslate";
import { phraseDictionary } from "@/lib/dictionary";
import { getCached, setCached } from "@/lib/translationCache";

function fallbackTranslate(text: string): string {
  return localTranslate(text);
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const lower = text.toLowerCase();

  // 1. Cache check
  let kikuyu = getCached(lower) ?? phraseDictionary[lower] ?? fallbackTranslate(text);
  setCached(lower, kikuyu);

  // 2. Restructure + prosody
  kikuyu = restructure(kikuyu);
  kikuyu = applyProsody(kikuyu);

  // 3. Phonetic conversion
  const phonetic = kikuyuPhonetic(kikuyu);

  // 4. Short text — single TTS call, no chunking
  if (phonetic.length < 120) {
    const audio = await ttsChunk(phonetic);
    return new Response(audio, { headers: { "Content-Type": "audio/mpeg" } });
  }

  // 5. Long text — split and run chunks in parallel
  const chunks = splitChunks(phonetic).filter(c => c.trim().length > 0);
  const audioBuffers = await Promise.all(chunks.map(c => ttsChunk(c)));
  const merged = Buffer.concat(audioBuffers.map(b => Buffer.from(b)));

  return new Response(merged, { headers: { "Content-Type": "audio/mpeg" } });
}
