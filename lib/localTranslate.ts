import { dictionary } from './kikuyuDictionary';
import { phrases, phoneticConvert } from './kikuyuPhrases';

const fillers = [
  { word: "ni",     use: "emphasis"    },
  { word: "ati",    use: "explanation" },
  { word: "riria",  use: "pause"       },
  { word: "niwega", use: "soft_ending" },
] as const;

type FillerUse = typeof fillers[number]["use"];

// Single source of truth — built from the phrases array
const phraseMap: Record<string, string> = phrases.reduce((acc, p) => {
  acc[p.english.toLowerCase()] = p.kikuyu;
  return acc;
}, {} as Record<string, string>);

/**
 * Smart local translator
 * Priority:
 * 1. Phrase map exact match
 * 2. Partial phrase match (longest wins)
 * 3. Word-by-word dictionary fallback
 */
export function localTranslate(text: string): string {
  const lower = text.toLowerCase().trim();

  // 1. Exact match
  if (phraseMap[lower]) return phoneticConvert(phraseMap[lower]);

  // 2. Partial match (longest wins)
  let bestMatch: string | null = null;
  let bestLength = 0;

  for (const [key, value] of Object.entries(phraseMap)) {
    if (lower.includes(key) && key.length > bestLength) {
      bestMatch = value;
      bestLength = key.length;
    }
  }

  if (bestMatch) return phoneticConvert(bestMatch);

  // 3. Word-by-word dictionary fallback
  const words = lower.split(' ');
  const translated = words.map(word => dictionary[word] || word);
  return phoneticConvert(translated.join(' '));
}

export function hasLocalTranslation(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return !!phraseMap[lower];
}

/**
 * Injects Kikuyu fillers into a translated sentence.
 * - emphasis:    prepends "ni" before the sentence
 * - explanation: inserts "ati" after the first word
 * - pause:       inserts "riria" at the midpoint
 * - soft_ending: appends "niwega" at the end
 */
export function addFillers(text: string): string {
  let words = text.trim().split(" ");

  for (const filler of fillers) {
    switch (filler.use as FillerUse) {
      case "emphasis":
        words = [filler.word, ...words];
        break;
      case "explanation":
        words.splice(1, 0, filler.word);
        break;
      case "pause": {
        const mid = Math.floor(words.length / 2);
        words.splice(mid, 0, filler.word);
        break;
      }
      case "soft_ending":
        words = [...words, filler.word];
        break;
    }
  }

  return words.join(" ").replace(/\s+/g, " ").trim();
}
