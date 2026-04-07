const ELEVENLABS_API = 'https://api.elevenlabs.io/v1';

export interface TTSOptions {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

/**
 * Prepares Kikuyu text for better TTS intonation:
 * - double spaces → comma pause
 * - ensures sentence-ending punctuation
 */
export function prepareTTSText(text: string): string {
  return text
    .replace(/\s{2,}/g, ', ')
    .replace(/([a-zA-Z])\s*$/, '$1.')   // ensure trailing period for pitch drop
    .replace(/([a-z])([A-Z])/g, '$1. $2')
    .trim();
}

/**
 * Calls ElevenLabs TTS and returns raw audio ArrayBuffer.
 */
export async function synthesizeSpeech(
  text: string,
  apiKey: string,
  voiceId: string,
  options: TTSOptions = {}
): Promise<ArrayBuffer> {
  const {
    stability = 0.35,
    similarity_boost = 0.80,
    style = 0.45,
    use_speaker_boost = true,
  } = options;

  const response = await fetch(`${ELEVENLABS_API}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: prepareTTSText(text),
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability, similarity_boost, style, use_speaker_boost },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.detail?.message || `ElevenLabs error: ${response.status}`);
  }

  return response.arrayBuffer();
}

/**
 * Lightweight chunk TTS — uses env vars directly.
 * Useful for streaming or splitting long text into pieces.
 */
export async function ttsChunk(text: string): Promise<ArrayBuffer> {
  const res = await fetch(`${ELEVENLABS_API}/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.3,
        similarity_boost: 0.9,
        style: 0.2,
      },
    }),
  });
  return res.arrayBuffer();
}
