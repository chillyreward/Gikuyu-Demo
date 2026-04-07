import { translate } from "@/lib/translate";
import { phonemePipeline } from "@/lib/phonemeEngine";
import { ttsChunk } from "@/lib/elevenlabs";

export async function process(text: string): Promise<ArrayBuffer[]> {
  // 1. Translate
  const kikuyu = await translate(text);

  // 2. Convert to speech-ready phonemes
  const phonetic = phonemePipeline(kikuyu);

  // 3. Split into chunks
  const chunks = phonetic.split(",").map(c => c.trim()).filter(Boolean);

  // 4. TTS — parallel per chunk
  const audio = await Promise.all(chunks.map(c => ttsChunk(c)));

  return audio;
}
