import { phonemeRules } from "./phonemes";

export function toPhonemes(text: string): string {
  // Sort longest patterns first to avoid partial matches (e.g. ng' before ng)
  const sorted = Object.entries(phonemeRules).sort((a, b) => b[0].length - a[0].length);
  let output = text.toLowerCase();
  for (const [key, value] of sorted) {
    output = output.replace(new RegExp(key.replace(/'/g, "\\'"), "g"), value);
  }
  return output;
}

export function addSyllableBreaks(text: string): string {
  return text
    .replace(/([aeiou])/g, "$1-") // split after vowels
    .replace(/-$/, "")             // remove trailing dash
    .replace(/-/g, " ");           // dashes → spaces for TTS pacing
}

import { applyProsody } from "./kikuyu";

export function phonemePipeline(text: string): string {
  let t = toPhonemes(text);
  t = addSyllableBreaks(t);
  t = applyProsody(t);
  return t;
}
