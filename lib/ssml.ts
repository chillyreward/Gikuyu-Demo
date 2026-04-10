/**
 * Builds SSML markup for Kikuyu TTS.
 * ElevenLabs supports a subset of SSML via eleven_multilingual_v2.
 */

export function wrapSSML(text: string): string {
  return `<speak>${text}</speak>`;
}

/**
 * Converts plain Kikuyu text into SSML with natural pauses and emphasis.
 * - Commas → short break (300ms)
 * - Periods / sentence ends → longer break (500ms)
 * - Question marks → rising inflection break (400ms)
 * - "..." → pause (400ms)
 */
export function toSSML(text: string): string {
  const inner = text
    .trim()
    .replace(/\.\.\./g, '<break time="400ms"/>')
    .replace(/([.!])\s+/g, '$1<break time="500ms"/>')
    .replace(/\?\s*/g, '?<break time="400ms"/>')
    .replace(/,\s*/g, ',<break time="300ms"/>');

  return wrapSSML(inner);
}

/**
 * Builds a greeting-style SSML phrase:
 * e.g. toGreetingSSML("Neewega", "Wee mwega")
 * → <speak>Neewega...<break time="400ms"/>Wee mwega?</speak>
 */
export function toGreetingSSML(opening: string, question: string): string {
  return wrapSSML(`${opening}...<break time="400ms"/>${question}?`);
}
