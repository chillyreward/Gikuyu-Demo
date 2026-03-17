export interface Phrase {
  english: string;
  swahili: string;
  kikuyu: string;
  phonetic: string;
  category: string;
}

export const phrases: Phrase[] = [
  { english: "how are you", swahili: "habari yako", kikuyu: "Wi mwega", phonetic: "Wee mwega", category: "greetings" },
  { english: "good morning", swahili: "habari za asubuhi", kikuyu: "Wega wa ruciini", phonetic: "Wega wa rooceenee", category: "greetings" },
  { english: "good evening", swahili: "habari za jioni", kikuyu: "Wega wa hwa-ini", phonetic: "Wega wa hwa-eenee", category: "greetings" },
  { english: "welcome", swahili: "karibu", kikuyu: "Niwega kuri", phonetic: "Neewega kooree", category: "greetings" },
  { english: "goodbye", swahili: "kwaheri", kikuyu: "Tigwo na thayu", phonetic: "Teegwo na thayoo", category: "greetings" },
  { english: "thank you", swahili: "asante", kikuyu: "Ni ngatho", phonetic: "Nee ngatho", category: "greetings" },
  { english: "thank you very much", swahili: "asante sana", kikuyu: "Ni ngatho muno", phonetic: "Nee ngatho moono", category: "greetings" },
  { english: "you are welcome", swahili: "karibu sana", kikuyu: "Niwega muno", phonetic: "Neewega moono", category: "greetings" },
  { english: "what is your name", swahili: "jina lako ni nani", kikuyu: "Riitwa riaku ni ruu", phonetic: "Reeetwa reaku nee roo", category: "greetings" },
  { english: "we are happy to have you", swahili: "tunafurahi kuwa nawe", kikuyu: "Nituri na gikeno kugukuona", phonetic: "Neetoree na geekeno koogookooona", category: "greetings" },
  { english: "please enter your phone number", swahili: "tafadhali ingiza nambari yako ya simu", kikuyu: "Tafadhali tuhu namba yaku ya thimu", phonetic: "Tafadhali toohu namba yaku ya theemu", category: "phone" },
  { english: "please wait", swahili: "tafadhali subiri", kikuyu: "Tafadhali riria hanini", phonetic: "Tafadhali reerea haneenee", category: "phone" },
  { english: "your call is important", swahili: "simu yako ni muhimu", kikuyu: "Ita yaku ni ya bata", phonetic: "Eeta yaku nee ya bata", category: "phone" },
  { english: "press one", swahili: "bonyeza moja", kikuyu: "Kanda imwe", phonetic: "Kanda eemwe", category: "phone" },
  { english: "press two", swahili: "bonyeza mbili", kikuyu: "Kanda igiri", phonetic: "Kanda eegeeree", category: "phone" },
  { english: "welcome to todays news", swahili: "karibu kwenye habari za leo", kikuyu: "Niwega kuri uhoro wa umuthi", phonetic: "Neewega kooree oohoro wa oomoothi", category: "news" },
  { english: "todays news", swahili: "habari za leo", kikuyu: "Uhoro wa umuthi", phonetic: "Oohoro wa oomoothi", category: "news" },
  { english: "breaking news", swahili: "habari za haraka", kikuyu: "Uhoro wa haraka", phonetic: "Oohoro wa haraka", category: "news" },
  { english: "good news", swahili: "habari njema", kikuyu: "Uhoro mwega", phonetic: "Oohoro mwega", category: "news" },
  { english: "i am hungry", swahili: "nina njaa", kikuyu: "Ni njaa iri", phonetic: "Nee njaa eeree", category: "food" },
  { english: "let us eat", swahili: "tukule", kikuyu: "Turie", phonetic: "Tooree", category: "food" },
  { english: "the food is ready", swahili: "chakula kiko tayari", kikuyu: "Irio ni iri", phonetic: "Eerio nee eeree", category: "food" },
  { english: "where are you going", swahili: "unakwenda wapi", kikuyu: "Uendaga ku", phonetic: "Ooendaga koo", category: "places" },
  { english: "i am going home", swahili: "ninaenda nyumbani", kikuyu: "Ni nendaga nyumba", phonetic: "Nee nendaga nyoomba", category: "places" },
  { english: "the market", swahili: "sokoni", kikuyu: "Mutuura", phonetic: "Mootooora", category: "places" },
  { english: "the hospital", swahili: "hospitali", kikuyu: "Ndugu", phonetic: "Ndoogoo", category: "places" },
  { english: "what time is it", swahili: "ni saa ngapi", kikuyu: "Ni saa ngapi", phonetic: "Nee saa ngapi", category: "time" },
  { english: "it is morning", swahili: "ni asubuhi", kikuyu: "Ni ruciini", phonetic: "Nee rooceenee", category: "time" },
  { english: "see you tomorrow", swahili: "tutaonana kesho", kikuyu: "Tuguonana ruciu", phonetic: "Toogoooonana roocoo", category: "time" },
  { english: "i am happy", swahili: "niko furaha", kikuyu: "Ni gikeno giri", phonetic: "Nee geekeno geeree", category: "emotions" },
  { english: "i am sorry", swahili: "samahani", kikuyu: "Ni uuru wakwa", phonetic: "Nee uuru wakwa", category: "emotions" },
  { english: "i love you", swahili: "nakupenda", kikuyu: "Ni wendo wakwa", phonetic: "Nee wendo wakwa", category: "emotions" },
  { english: "it is raining", swahili: "inanyesha", kikuyu: "Mbura iri", phonetic: "Mboora eeree", category: "nature" },
  { english: "the sun is shining", swahili: "jua linawaka", kikuyu: "Ruua ruri", phonetic: "Roooa rooree", category: "nature" },
  { english: "the mountain", swahili: "mlima", kikuyu: "Kirima", phonetic: "Keereema", category: "nature" },
  { english: "how can i help you", swahili: "naweza kukusaidia vipi", kikuyu: "Ni atia ndeithia", phonetic: "Nee ateea ndeethia", category: "sentences" },
  { english: "please repeat that", swahili: "tafadhali rudia", kikuyu: "Tafadhali ugie ringi", phonetic: "Tafadhali oogee reengee", category: "sentences" },
  { english: "i do not understand", swahili: "sielewi", kikuyu: "Ndimenyaga", phonetic: "Ndeemenyaga", category: "sentences" },
  { english: "speak slowly", swahili: "sema polepole", kikuyu: "Ugie na nguru nini", phonetic: "Oogee na nguru neenee", category: "sentences" },
];

export function phoneticConvert(text: string): string {
  return text
    .replace(/mw/g, "mwe")
    .replace(/ng'/g, "ng")
    .replace(/ny/g, "ni")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchPhrases(query: string, category?: string): Phrase[] {
  const lower = query.toLowerCase();
  return phrases.filter(p => {
    const matchesQuery =
      p.english.toLowerCase().includes(lower) ||
      p.swahili.toLowerCase().includes(lower) ||
      p.kikuyu.toLowerCase().includes(lower);
    const matchesCategory = category ? p.category === category : true;
    return matchesQuery && matchesCategory;
  });
}

export function getCategories(): string[] {
  return [...new Set(phrases.map(p => p.category))];
}