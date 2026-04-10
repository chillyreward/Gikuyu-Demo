export const phraseDictionary: Record<string, string> = {
  "please enter your phone number":                  "Tuhu namba yaku ya thimu, ni, tafadhali",
  "how are you":                                     "Wee mwega?",
  "how many varieties of coffee are grown in kenya": "ni midhemba irikuu ya kahuu ikuragio kenya",
  "thank you very much":                             "Ni ngatho muno",
};

/**
 * Maps phrases to pre-recorded audio file paths in /public/audio/.
 * When a match is found, the exact audio is played — no TTS needed.
 */
export const audioLibrary: Record<string, string> = {
  "how many varieties of coffee are grown in kenya": "/audio/coffee-varieties.wav",
};

export function patternTranslate(text: string): string {
  return text
    .replace("enter",  "tũhũ")
    .replace("phone",  "thimu")
    .replace("number", "namba")
    .replace("please", "tafadhali");
}
