import { NextRequest } from "next/server";
import { restructure, addRhythm, kikuyuPhonetic, splitChunks } from "@/lib/kikuyu";
import { ttsChunk } from "@/lib/elevenlabs";
import { localTranslate } from "@/lib/localTranslate";
import { phraseDictionary } from "@/lib/dictionary";

function fallbackTranslate(text: string): string {
  return localTranslate(text);
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  // 1. Lookup in phrase dictionary, fallback to local translate
  let kikuyu = phraseDictionary[text.toLowerCase()] ?? fallbackTranslate(text);

  // 2. Improve Kikuyu structure
  kikuyu = restructure(kikuyu);

  // 3. Add natural rhythm
  kikuyu = addRhythm(kikuyu);

  // 4. Convert to phonetic
  const phonetic = kikuyuPhonetic(kikuyu);

  // 5. Split into chunks
  const chunks = splitChunks(phonetic);

  // 6. Generate audio per chunk
  const audioBuffers: ArrayBuffer[] = [];
  for (const chunk of chunks) {
    const audio = await ttsChunk(chunk);
    audioBuffers.push(audio);
  }

  // Merge all chunks into a single audio buffer
  const merged = Buffer.concat(audioBuffers.map(b => Buffer.from(b)));

  return new Response(merged, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
