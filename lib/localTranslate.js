import { dictionary } from "./kikuyuDictionary.js";
import { phrases } from "./kikuyuPhrases.js";
import { phoneticConvert } from "./kikuyuPhrases.js";

// Extract phrase map from kikuyuPhrases array
const phraseMap = phrases.reduce((acc, p) => {
  acc[p.english.toLowerCase()] = p.kikuyu;
  return acc;
}, {});

// Also add the inline phrases object entries
const inlinePhrases = {
  "please enter your phone number": "tafadhali tũhũ namba yaku ya thimu",
  "welcome to today's news": "nĩwega kũrĩ ũhoro wa ũmũthĩ",
  "how are you": "wĩ mwega",
  "thank you very much": "nĩ ngatho mũno",
  "what is your name": "rĩĩtwa rĩaku nĩ rũũ",
  "we are happy to have you": "nĩtũrĩ na gĩkeno kũgũkũona",
  "please wait": "tafadhali rĩrĩa hanini",
};

/**
 * Smart local translator
 * Priority:
 * 1. Inline phrase exact match (highest priority)
 * 2. Phrase array exact match
 * 3. Word-by-word dictionary fallback
 */
export function localTranslate(text) {
  const lower = text.toLowerCase().trim();

  // 1️⃣ Inline phrase override (highest priority)
  if (inlinePhrases[lower]) {
    return phoneticConvert(inlinePhrases[lower]);
  }

  // 2️⃣ Phrase array exact match
  if (phraseMap[lower]) {
    return phoneticConvert(phraseMap[lower]);
  }

  // 3️⃣ Try partial phrase match (longest match wins)
  let bestMatch = null;
  let bestLength = 0;
  const allPhrases = { ...inlinePhrases, ...phraseMap };

  for (const [key, value] of Object.entries(allPhrases)) {
    if (lower.includes(key) && key.length > bestLength) {
      bestMatch = value;
      bestLength = key.length;
    }
  }

  if (bestMatch) {
    return phoneticConvert(bestMatch);
  }

  // 4️⃣ Word-by-word dictionary fallback
  const words = lower.split(" ");
  const translated = words.map(word => dictionary[word] || word);
  return phoneticConvert(translated.join(" "));
}

/**
 * Check if a local translation exists (to decide whether to call OpenAI)
 */
export function hasLocalTranslation(text) {
  const lower = text.toLowerCase().trim();
  if (inlinePhrases[lower]) return true;
  if (phraseMap[lower]) return true;
  return false;
}
