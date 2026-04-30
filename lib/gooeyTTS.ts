/**
 * Gooey.ai TTS
 * Primary: GhanaNLP — African language TTS, closest to the Kikuyu voice
 * Fallback: MMS_TTS with Kikuyu language code
 */

export async function synthesizeWithGooey(
  text: string,
  apiKey: string
): Promise<ArrayBuffer> {
  // Try GhanaNLP first — this is the model used in the coffee-varieties audio
  try {
    return await gooeyRequest(apiKey, {
      text_prompt: text,
      tts_provider: "GHANA_NLP",
      ghana_nlp_tts_language: "ki",  // Kikuyu
    });
  } catch {
    // Fallback to MMS Kikuyu
    try {
      return await gooeyRequest(apiKey, {
        text_prompt: text,
        tts_provider: "MMS_TTS",
        mms_tts_language: "kik",
      });
    } catch {
      // Final fallback: OpenAI onyx via Gooey
      return await gooeyRequest(apiKey, {
        text_prompt: text,
        tts_provider: "OPEN_AI",
        openai_voice_name: "onyx",
      });
    }
  }
}

async function gooeyRequest(apiKey: string, payload: object): Promise<ArrayBuffer> {
  const response = await fetch("https://api.gooey.ai/v2/TextToSpeech/", {
    method: "POST",
    headers: {
      "Authorization": `bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.detail || `Gooey TTS error: ${response.status}`);
  }

  const result = await response.json();
  const audioUrl: string = result?.output?.audio_url;
  if (!audioUrl) throw new Error("Gooey TTS: no audio_url in response");

  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) throw new Error("Gooey TTS: failed to fetch audio");

  return audioResponse.arrayBuffer();
}
