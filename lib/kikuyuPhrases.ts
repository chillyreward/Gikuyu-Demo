export interface Phrase {
  english: string;
  swahili: string;
  kikuyu: string;
  category: string;
}

export interface Filler {
  word: string;
  use: "emphasis" | "explanation" | "pause" | "soft_ending";
}

export const fillers: Filler[] = [
  { word: "ni",     use: "emphasis"    },
  { word: "ati",    use: "explanation" },
  { word: "riria",  use: "pause"       },
  { word: "niwega", use: "soft_ending" },
];

export const phrases: Phrase[] = [
  { english: "hello",                          swahili: "habari",                                    kikuyu: "wi mwega",                        category: "greetings" },
  { english: "how are you",                    swahili: "habari yako",                               kikuyu: "wi mwega",                        category: "greetings" },
  { english: "i am fine",                      swahili: "niko sawa",                                 kikuyu: "ndi mwega",                       category: "greetings" },
  { english: "welcome",                        swahili: "karibu",                                    kikuyu: "niwega",                          category: "greetings" },
  { english: "good morning",                   swahili: "habari ya asubuhi",                         kikuyu: "wega wa ruciini",                 category: "greetings" },
  { english: "good evening",                   swahili: "habari ya jioni",                           kikuyu: "wega wa hwa-ini",                 category: "greetings" },
  { english: "goodbye",                        swahili: "kwaheri",                                   kikuyu: "tigwo na thayu",                  category: "greetings" },
  { english: "thank you",                      swahili: "asante",                                    kikuyu: "ni ngatho",                       category: "greetings" },
  { english: "thank you very much",            swahili: "asante sana",                               kikuyu: "ni ngatho muno",                  category: "greetings" },
  { english: "you are welcome",                swahili: "karibu sana",                               kikuyu: "niwega muno",                     category: "greetings" },
  { english: "please",                         swahili: "tafadhali",                                 kikuyu: "tafadhali",                       category: "greetings" },
  { english: "sorry",                          swahili: "samahani",                                  kikuyu: "pole",                            category: "greetings" },
  { english: "what is your name",              swahili: "jina lako nani",                            kikuyu: "riitwa riaku ni ruu",             category: "identity" },
  { english: "my name is",                     swahili: "jina langu ni",                             kikuyu: "riitwa riakwa ni",                category: "identity" },
  { english: "we are happy to have you",       swahili: "tunafurahi kuwa nawe",                      kikuyu: "nituri na gikeno kugukuona",      category: "identity" },
  { english: "where are you",                  swahili: "uko wapi",                                  kikuyu: "uri ku",                          category: "places" },
  { english: "come here",                      swahili: "njoo hapa",                                 kikuyu: "uuka haha",                       category: "places" },
  { english: "go there",                       swahili: "nenda pale",                                kikuyu: "dhii kuo",                        category: "places" },
  { english: "where are you going",            swahili: "unakwenda wapi",                            kikuyu: "uendaga ku",                      category: "places" },
  { english: "i am going home",                swahili: "ninaenda nyumbani",                         kikuyu: "ni nendaga nyumba",               category: "places" },
  { english: "the market",                     swahili: "sokoni",                                    kikuyu: "mutuura",                         category: "places" },
  { english: "the hospital",                   swahili: "hospitali",                                 kikuyu: "ndugu",                           category: "places" },
  { english: "enter your phone number",        swahili: "ingiza nambari yako",                       kikuyu: "tuhu namba yaku ya dhimu",        category: "phone" },
  { english: "please enter your phone number", swahili: "tafadhali ingiza nambari yako ya simu",     kikuyu: "tafadhali tuhu namba yaku ya dhimu", category: "phone" },
  { english: "invalid number",                 swahili: "namba si sahihi",                           kikuyu: "namba ti njega",                  category: "phone" },
  { english: "try again",                      swahili: "jaribu tena",                               kikuyu: "geria ringi",                     category: "phone" },
  { english: "processing",                     swahili: "inachakata",                                kikuyu: "iraruta wira",                    category: "phone" },
  { english: "completed",                      swahili: "imekamilika",                               kikuyu: "niyadhira",                       category: "phone" },
  { english: "failed",                         swahili: "imeshindikana",                             kikuyu: "niyarema",                        category: "phone" },
  { english: "please wait",                    swahili: "tafadhali subiri",                          kikuyu: "riria hanini",                    category: "phone" },
  { english: "your call is important",         swahili: "simu yako ni muhimu",                       kikuyu: "ita yaku ni ya bata",             category: "phone" },
  { english: "press one",                      swahili: "bonyeza moja",                              kikuyu: "kanda imwe",                      category: "phone" },
  { english: "press two",                      swahili: "bonyeza mbili",                             kikuyu: "kanda igiri",                     category: "phone" },
  { english: "your request is complete",       swahili: "ombi lako limekamilika",                    kikuyu: "wira waku niwadira",              category: "phone" },
  { english: "an error occurred",              swahili: "kosa limetokea",                            kikuyu: "hari na dhina",                   category: "phone" },
  { english: "listen to me",                   swahili: "nisikilize",                                kikuyu: "ndugukire",                       category: "instructions" },
  { english: "wait a moment",                  swahili: "subiri kidogo",                             kikuyu: "riria hanini",                    category: "instructions" },
  { english: "hurry up",                       swahili: "harakisha",                                 kikuyu: "nigudhi na hinya",                category: "instructions" },
  { english: "stop",                           swahili: "simama",                                    kikuyu: "tigira",                          category: "instructions" },
  { english: "sit down",                       swahili: "kaa chini",                                 kikuyu: "ikara dhi",                       category: "instructions" },
  { english: "stand up",                       swahili: "simama",                                    kikuyu: "tigira wiri",                     category: "instructions" },
  { english: "please repeat that",             swahili: "tafadhali rudia",                           kikuyu: "tafadhali ugie ringi",            category: "instructions" },
  { english: "speak slowly",                   swahili: "sema polepole",                             kikuyu: "ugie na nguru nini",              category: "instructions" },
  { english: "i understand",                   swahili: "ninaelewa",                                 kikuyu: "ndikumenya",                      category: "sentences" },
  { english: "i don't understand",             swahili: "sielewi",                                   kikuyu: "nditiumenya",                     category: "sentences" },
  { english: "i do not understand",            swahili: "sielewi",                                   kikuyu: "ndimenyaga",                      category: "sentences" },
  { english: "how can i help you",             swahili: "naweza kukusaidiaje",                       kikuyu: "ndingugudeidhia atia",            category: "sentences" },
  { english: "i am happy",                     swahili: "nina furaha",                               kikuyu: "ndi na gikeno",                   category: "emotions" },
  { english: "don't worry",                    swahili: "usijali",                                   kikuyu: "ndugacooke na meciiria",          category: "emotions" },
  { english: "everything is okay",             swahili: "kila kitu sawa",                            kikuyu: "indo ciothe ni njega",            category: "emotions" },
  { english: "i am sorry",                     swahili: "samahani",                                  kikuyu: "ni uuru wakwa",                   category: "emotions" },
  { english: "i love you",                     swahili: "nakupenda",                                 kikuyu: "ni wendo wakwa",                  category: "emotions" },
  { english: "what time is it",                swahili: "ni saa ngapi",                              kikuyu: "ni saa ngapi",                    category: "time" },
  { english: "it is morning",                  swahili: "ni asubuhi",                                kikuyu: "ni ruciini",                      category: "time" },
  { english: "see you tomorrow",               swahili: "tutaonana kesho",                           kikuyu: "tuguonana ruciu",                 category: "time" },
  { english: "i am hungry",                    swahili: "nina njaa",                                 kikuyu: "ni njaa iri",                     category: "food" },
  { english: "let us eat",                     swahili: "tukule",                                    kikuyu: "turie",                           category: "food" },
  { english: "the food is ready",              swahili: "chakula kiko tayari",                       kikuyu: "irio ni iri",                     category: "food" },
  { english: "it is raining",                  swahili: "inanyesha",                                 kikuyu: "mbura iri",                       category: "nature" },
  { english: "the sun is shining",             swahili: "jua linawaka",                              kikuyu: "ruua ruri",                       category: "nature" },
  { english: "the mountain",                   swahili: "mlima",                                     kikuyu: "kirima",                          category: "nature" },
  { english: "welcome to todays news",         swahili: "karibu kwenye habari za leo",               kikuyu: "niwega kuri uhoro wa umudhi",     category: "news" },
  { english: "welcome to todays program",      swahili: "karibu kwenye kipindi",                     kikuyu: "niwega kuri uhoro wa umudhi",     category: "news" },
  { english: "todays news",                    swahili: "habari za leo",                             kikuyu: "uhoro wa umudhi",                 category: "news" },
  { english: "breaking news",                  swahili: "habari za haraka",                          kikuyu: "uhoro wa haraka",                 category: "news" },
  { english: "good news",                      swahili: "habari njema",                              kikuyu: "uhoro mwega",                     category: "news" },
  { english: "thank you for listening",        swahili: "asante kwa kusikiliza",                     kikuyu: "ni ngatho muno kuigua",           category: "news" },
];

export function phoneticConvert(text: string): string {
  return text
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
