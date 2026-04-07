export const phraseDictionary: Record<string, string> = {
  "please enter your phone number": "Tũhũ namba yaku ya thimu, nĩ, tafadhali",
  "how are you":                    "Wĩ mwega",
  "thank you very much":            "Nĩ ngatho mũno",
};

export function patternTranslate(text: string): string {
  return text
    .replace("enter",  "tũhũ")
    .replace("phone",  "thimu")
    .replace("number", "namba")
    .replace("please", "tafadhali");
}
