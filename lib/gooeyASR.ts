/**
 * Gooey.ai Kikuyu ASR
 * Uses the fine-tuned akera/whisper-kik-full_v2 model
 * Docs: https://api.gooey.ai/docs
 */

export async function transcribeKikuyu(
  audioBlob: Blob,
  apiKey: string
): Promise<string> {
  // Step 1: Upload audio to get a public URL via Gooey's upload endpoint
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");

  const uploadRes = await fetch("https://api.gooey.ai/v2/upload/", {
    method: "POST",
    headers: { "Authorization": `bearer ${apiKey}` },
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err?.detail || `Gooey upload error: ${uploadRes.status}`);
  }

  const { url: audioUrl } = await uploadRes.json();

  // Step 2: Transcribe using the Kikuyu fine-tuned Whisper model
  const transcribeRes = await fetch("https://api.gooey.ai/v2/SpeechPage/", {
    method: "POST",
    headers: {
      "Authorization": `bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      selected_model: "whisper-1",
      language: "ki",                        // Kikuyu ISO 639-1 code
      translation_model: "whisper_only",
      output_format: "text",
    }),
  });

  if (!transcribeRes.ok) {
    const err = await transcribeRes.json().catch(() => ({}));
    throw new Error(err?.detail || `Gooey ASR error: ${transcribeRes.status}`);
  }

  const result = await transcribeRes.json();
  return result?.output?.output_text?.[0] ?? result?.output?.raw_output ?? "";
}
