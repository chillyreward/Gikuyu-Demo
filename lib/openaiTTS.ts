/**
 * OpenAI TTS — simpler, cheaper alternative to ElevenLabs.
 * Supports: alloy, echo, fable, onyx, nova, shimmer
 * Models: tts-1 (faster), tts-1-hd (higher quality)
 */
export async function synthesizeWithOpenAI(
  text: string,
  apiKey: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "nova",
  model: "tts-1" | "tts-1-hd" = "tts-1"
): Promise<ArrayBuffer> {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      voice,
      input: text,
      response_format: "mp3",
      speed: 0.95, // slightly slower for clarity
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI TTS error: ${response.status}`);
  }

  return response.arrayBuffer();
}
