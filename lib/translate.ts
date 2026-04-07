import { phraseDictionary, patternTranslate } from "./dictionary";
import { aiTranslate } from "./aiTranslate";

export async function translate(text: string): Promise<string> {
  const lower = text.toLowerCase();

  // 1. Phrase match (best)
  if (phraseDictionary[lower]) return phraseDictionary[lower];

  // 2. Pattern translation
  const pattern = patternTranslate(lower);
  if (pattern !== lower) return pattern;

  // 3. Fallback AI
  return await aiTranslate(text);
}
