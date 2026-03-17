import { dictionary } from './kikuyuDictionary';
import { phrases, phoneticConvert } from './kikuyuPhrases';

// Build phrase map from array
const phraseMap: Record<string, string> = phrases.reduce((acc, p) => {
  acc[p.english.toLowerCase()] = p.kikuyu;
  return acc;
}, {} as Record<string, string>);

// Inline high-priority phrases
const inlinePhrases: Record<string, string> = {
  "please enter your phone number": "tafadhali tuhu namba yaku ya thimu",
  "welcome to todays news": "niwega kuri uhoro wa umuthi",
  "how are you": "wi mwega",
  "thank you very much": "ni ngatho muno",
  "what is your name": "riitwa riaku ni ruu",
  "we are happy to have you": "nituri na gikeno kugukuona",
  "please wait": "tafadhali riria hanini",
};

/**
 * Smart local translator
 * Priority:
 * 1. Inline phrase exact match
 * 2. Phrase array exact match
 * 3. Partial phrase match (longest wins)
 * 4. Word-by-word dictionary fallback
 */
export function localTranslate(text: string): string {
  const lower = text.toLowerCase().trim();

  // 1. Inline phrase
  if (inlinePhrases[lower]) return phoneticConvert(inlinePhrases[lower]);

  // 2. Phrase array exact match
  if (phraseMap[lower]) return phoneticConvert(phraseMap[lower]);

  // 3. Partial phrase match (longest wins)
  const allPhrases = { ...inlinePhrases, ...phraseMap };
  let bestMatch: string | null = null;
  let bestLength = 0;

  for (const [key, value] of Object.entries(allPhrases)) {
    if (lower.includes(key) && key.length > bestLength) {
      bestMatch = value;
      bestLength = key.length;
    }
  }

  if (bestMatch) return phoneticConvert(bestMatch);

  // 4. Word-by-word dictionary fallback
  const words = lower.split(' ');
  const translated = words.map(word => dictionary[word] || word);
  return phoneticConvert(translated.join(' '));
}

export function hasLocalTranslation(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return !!(inlinePhrases[lower] || phraseMap[lower]);
}
