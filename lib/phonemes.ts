export const phonemeRules: Record<string, string> = {
  "ĩ":   "i",
  "ũ":   "u",
  "th":  "dh",  // softer th
  "ng'": "ng",  // nasal
  "ny":  "ni",  // smoother output
  "mb":  "mb",
  "nd":  "nd",
  "ng":  "ng",
  "aa":  "aa",
  "ee":  "ee",
  "ii":  "ii",
  "oo":  "oo",
  "uu":  "uu",
};

/**
 * Applies phoneme rules in order — longer patterns first to avoid partial matches.
 */
export function applyPhonemes(text: string): string {
  const sorted = Object.entries(phonemeRules).sort((a, b) => b[0].length - a[0].length);
  return sorted.reduce((t, [from, to]) => t.replace(new RegExp(from, "g"), to), text);
}
