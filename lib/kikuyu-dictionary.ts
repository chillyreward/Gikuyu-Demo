// Kikuyu Dictionary - Natural spoken Kikuyu from Central Kenya

export interface DictionaryEntry {
  english: string;
  swahili: string;
  kikuyu: string;
  phonetic: string;
  category: string;
}

export const kikuyuDictionary: DictionaryEntry[] = [
  // --- GREETINGS ---
  { english: 'Hello', swahili: 'Habari', kikuyu: 'Wĩ mwega', phonetic: 'Wee mwega', category: 'greetings' },
  { english: 'Good morning', swahili: 'Habari ya asubuhi', kikuyu: 'Wega wa rũciinĩ', phonetic: 'Wega wa roocheenee', category: 'greetings' },
  { english: 'Good afternoon', swahili: 'Habari ya mchana', kikuyu: 'Ũrĩa mwega mũthenya', phonetic: 'Ooria mwega moothenya', category: 'greetings' },
  { english: 'Good evening', swahili: 'Habari ya jioni', kikuyu: 'Wega wa hwa-inĩ', phonetic: 'Wega wa hwa-eenee', category: 'greetings' },
  { english: 'Good night', swahili: 'Lala salama', kikuyu: 'Ũrĩa mwega ũtukũ', phonetic: 'Ooria mwega ootookoo', category: 'greetings' },
  { english: 'How are you?', swahili: 'Habari yako?', kikuyu: 'Wĩ mwega atĩa?', phonetic: 'Wee mwega atia?', category: 'greetings' },
  { english: 'I am fine', swahili: 'Niko sawa', kikuyu: 'Nĩ mwega', phonetic: 'Nee mwega', category: 'greetings' },
  { english: 'Welcome', swahili: 'Karibu', kikuyu: 'Nĩwega', phonetic: 'Neewega', category: 'greetings' },
  { english: 'Goodbye', swahili: 'Kwaheri', kikuyu: 'Tigwo na thayũ', phonetic: 'Teegwo na thayoo', category: 'greetings' },
  { english: 'See you later', swahili: 'Tutaonana', kikuyu: 'Tũgakorwo', phonetic: 'Toogakorwo', category: 'greetings' },
  { english: 'Today', swahili: 'Leo', kikuyu: 'Ũmũthĩ', phonetic: 'Oomoothi', category: 'greetings' },

  // --- COMMON PHRASES ---
  { english: 'Yes', swahili: 'Ndiyo', kikuyu: 'Ĩĩ', phonetic: 'Ee', category: 'common' },
  { english: 'No', swahili: 'Hapana', kikuyu: 'Aca', phonetic: 'Acha', category: 'common' },
  { english: 'Please', swahili: 'Tafadhali', kikuyu: 'Ndagũthaitha', phonetic: 'tafadhali', category: 'common' },
  { english: 'Thank you', swahili: 'Asante', kikuyu: 'Nĩ ngatho', phonetic: 'Nee ngatho', category: 'common' },
  { english: 'Thank you very much', swahili: 'Asante sana', kikuyu: 'Nĩ wega mũno mũno', phonetic: 'Nee wega moono moono', category: 'common' },
  { english: 'You are welcome', swahili: 'Karibu', kikuyu: 'Nĩwega', phonetic: 'Neewega', category: 'common' },
  { english: 'Welcome', swahili: 'Karibu', kikuyu: 'Nĩwega', phonetic: 'Neewega', category: 'common' },
  { english: 'Sorry', swahili: 'Samahani', kikuyu: 'Ndĩ na ũũru', phonetic: 'Ndee na ooru', category: 'common' },
  { english: 'Excuse me', swahili: 'Nisamehe', kikuyu: 'Ĩtigĩra', phonetic: 'Eetigira', category: 'common' },
  { english: 'I don\'t understand', swahili: 'Sielewi', kikuyu: 'Ndĩngĩũndũ', phonetic: 'Ndeengeeoondu', category: 'common' },
  { english: 'Please repeat', swahili: 'Rudia tena', kikuyu: 'Ũgaathome rĩngĩ', phonetic: 'Oogaathome reengee', category: 'common' },
  { english: 'Help', swahili: 'Msaada', kikuyu: 'Ndeithia', phonetic: 'Ndeithia', category: 'common' },
  { english: 'I need help', swahili: 'Nahitaji msaada', kikuyu: 'Nĩndagĩa ndeithia', phonetic: 'Neendagia ndeithia', category: 'common' },
  { english: 'Enter', swahili: 'Ingiza', kikuyu: 'Tũhũ', phonetic: 'Toohu', category: 'common' },
  { english: 'Phone', swahili: 'Simu', kikuyu: 'Thimu', phonetic: 'Theemu', category: 'common' },
  { english: 'Number', swahili: 'Nambari', kikuyu: 'Namba', phonetic: 'Namba', category: 'common' },
  { english: 'Your', swahili: 'Yako', kikuyu: 'Yaku', phonetic: 'Yaku', category: 'common' },
  { english: 'News', swahili: 'Habari', kikuyu: 'Ũhoro', phonetic: 'Oohoro', category: 'common' },
  { english: 'Technology', swahili: 'Teknolojia', kikuyu: 'Tekinoroji', phonetic: 'Tekinoroji', category: 'common' },

  // --- INTRODUCTIONS ---
  { english: 'What is your name?', swahili: 'Jina lako ni nani?', kikuyu: 'Wĩtagwo atĩa?', phonetic: 'Weetagwo atia?', category: 'introductions' },
  { english: 'My name is', swahili: 'Jina langu ni', kikuyu: 'Nĩĩtagwo', phonetic: 'Neeetagwo', category: 'introductions' },
  { english: 'Where are you from?', swahili: 'Unatoka wapi?', kikuyu: 'Ũtũũra kũ?', phonetic: 'Ootoora koo?', category: 'introductions' },
  { english: 'I am from Kenya', swahili: 'Natoka Kenya', kikuyu: 'Nĩ wa Kenya', phonetic: 'Nee wa Kenya', category: 'introductions' },
  { english: 'How old are you?', swahili: 'Una umri gani?', kikuyu: 'Ũrĩ na mĩaka mĩngĩ?', phonetic: 'Ooree na meeaka meengee?', category: 'introductions' },
  { english: 'Nice to meet you', swahili: 'Nafurahi kukujua', kikuyu: 'Nĩnjĩũkĩte gũkũona', phonetic: 'Neenjeeokeete gookooona', category: 'introductions' },

  // --- FAMILY ---
  { english: 'Mother', swahili: 'Mama', kikuyu: 'Nyina', phonetic: 'Nyeena', category: 'family' },
  { english: 'Father', swahili: 'Baba', kikuyu: 'Baba', phonetic: 'Baba', category: 'family' },
  { english: 'Child', swahili: 'Mtoto', kikuyu: 'Mwana', phonetic: 'Mwana', category: 'family' },
  { english: 'Brother', swahili: 'Kaka', kikuyu: 'Mũrũ wa ithe', phonetic: 'Mooroo wa ithe', category: 'family' },
  { english: 'Sister', swahili: 'Dada', kikuyu: 'Mwarĩ wa ithe', phonetic: 'Mwaree wa ithe', category: 'family' },
  { english: 'Grandmother', swahili: 'Bibi', kikuyu: 'Gũgũ', phonetic: 'Googoo', category: 'family' },
  { english: 'Grandfather', swahili: 'Babu', kikuyu: 'Gũgũ wa ithe', phonetic: 'Googoo wa ithe', category: 'family' },
  { english: 'Family', swahili: 'Familia', kikuyu: 'Nyũmba', phonetic: 'Nyoomba', category: 'family' },

  // --- NUMBERS ---
  { english: 'One', swahili: 'Moja', kikuyu: 'Ĩmwe', phonetic: 'Eemwe', category: 'numbers' },
  { english: 'Two', swahili: 'Mbili', kikuyu: 'Igĩrĩ', phonetic: 'Eegiree', category: 'numbers' },
  { english: 'Three', swahili: 'Tatu', kikuyu: 'Ithatũ', phonetic: 'Eethatu', category: 'numbers' },
  { english: 'Four', swahili: 'Nne', kikuyu: 'Inya', phonetic: 'Eenya', category: 'numbers' },
  { english: 'Five', swahili: 'Tano', kikuyu: 'Ĩtano', phonetic: 'Eetano', category: 'numbers' },
  { english: 'Six', swahili: 'Sita', kikuyu: 'Ĩtandatũ', phonetic: 'Eetandatu', category: 'numbers' },
  { english: 'Seven', swahili: 'Saba', kikuyu: 'Mũgwanja', phonetic: 'Moogwanja', category: 'numbers' },
  { english: 'Eight', swahili: 'Nane', kikuyu: 'Ĩnyanya', phonetic: 'Eenyanya', category: 'numbers' },
  { english: 'Nine', swahili: 'Tisa', kikuyu: 'Kenda', phonetic: 'Kenda', category: 'numbers' },
  { english: 'Ten', swahili: 'Kumi', kikuyu: 'Ikũmi', phonetic: 'Eekoomi', category: 'numbers' },

  // --- FOOD & DRINK ---
  { english: 'Water', swahili: 'Maji', kikuyu: 'Maaĩ', phonetic: 'Maai', category: 'food' },
  { english: 'Food', swahili: 'Chakula', kikuyu: 'Irio', phonetic: 'Eerio', category: 'food' },
  { english: 'Milk', swahili: 'Maziwa', kikuyu: 'Mĩĩ', phonetic: 'Meee', category: 'food' },
  { english: 'Meat', swahili: 'Nyama', kikuyu: 'Nyama', phonetic: 'Nyama', category: 'food' },
  { english: 'Vegetables', swahili: 'Mboga', kikuyu: 'Mbũrũ', phonetic: 'Mbooru', category: 'food' },
  { english: 'Maize', swahili: 'Mahindi', kikuyu: 'Mũgĩmbi', phonetic: 'Moogeembi', category: 'food' },
  { english: 'Beans', swahili: 'Maharagwe', kikuyu: 'Njũgũ', phonetic: 'Njoogoo', category: 'food' },
  { english: 'I am hungry', swahili: 'Nina njaa', kikuyu: 'Nĩnjĩũkĩte njara', phonetic: 'Neenjeeokeete njara', category: 'food' },
  { english: 'I am thirsty', swahili: 'Nina kiu', kikuyu: 'Nĩnjĩũkĩte ĩũ', phonetic: 'Neenjeeokeete eeu', category: 'food' },

  // --- PLACES ---
  { english: 'Home', swahili: 'Nyumbani', kikuyu: 'Nyũmba', phonetic: 'Nyoomba', category: 'places' },
  { english: 'School', swahili: 'Shule', kikuyu: 'Kĩrĩra', phonetic: 'Keerera', category: 'places' },
  { english: 'Hospital', swahili: 'Hospitali', kikuyu: 'Ndũgũ', phonetic: 'Ndoogoo', category: 'places' },
  { english: 'Market', swahili: 'Soko', kikuyu: 'Mũtũũra', phonetic: 'Mootoora', category: 'places' },
  { english: 'Church', swahili: 'Kanisa', kikuyu: 'Kanitha', phonetic: 'Kanitha', category: 'places' },
  { english: 'Road', swahili: 'Barabara', kikuyu: 'Njĩra', phonetic: 'Njeera', category: 'places' },
  { english: 'Village', swahili: 'Kijiji', kikuyu: 'Mũcĩĩ', phonetic: 'Moochee', category: 'places' },

  // --- EMOTIONS ---
  { english: 'Happy', swahili: 'Furaha', kikuyu: 'Gĩkeno', phonetic: 'Geekeno', category: 'emotions' },
  { english: 'Sad', swahili: 'Huzuni', kikuyu: 'Mũrimũ wa ngoro', phonetic: 'Mooreemoo wa ngoro', category: 'emotions' },
  { english: 'Angry', swahili: 'Hasira', kikuyu: 'Ũkũũru', phonetic: 'Ookooru', category: 'emotions' },
  { english: 'Tired', swahili: 'Choka', kikuyu: 'Nĩnjĩũkĩte', phonetic: 'Neenjeeokeete', category: 'emotions' },
  { english: 'I love you', swahili: 'Nakupenda', kikuyu: 'Nĩngwendete', phonetic: 'Neengwendete', category: 'emotions' },
  { english: 'I miss you', swahili: 'Nakukosa', kikuyu: 'Nĩnjĩkũhĩtĩkĩte', phonetic: 'Neenjeekooheeteekeete', category: 'emotions' },

  // --- TIME ---
  { english: 'Tomorrow', swahili: 'Kesho', kikuyu: 'Rũciũ', phonetic: 'Roochoo', category: 'time' },
  { english: 'Yesterday', swahili: 'Jana', kikuyu: 'Ira', phonetic: 'Eera', category: 'time' },
  { english: 'Morning', swahili: 'Asubuhi', kikuyu: 'Rũciinĩ', phonetic: 'Roocheenee', category: 'time' },
  { english: 'Evening', swahili: 'Jioni', kikuyu: 'Hwaĩ-inĩ', phonetic: 'Hwai-eenee', category: 'time' },
  { english: 'Night', swahili: 'Usiku', kikuyu: 'Ũtukũ', phonetic: 'Ootookoo', category: 'time' },
  { english: 'Now', swahili: 'Sasa', kikuyu: 'Rĩu', phonetic: 'Reeu', category: 'time' },
  { english: 'Later', swahili: 'Baadaye', kikuyu: 'Rear', phonetic: 'Rear', category: 'time' },

  // --- BODY ---
  { english: 'Head', swahili: 'Kichwa', kikuyu: 'Mũtwe', phonetic: 'Mootwe', category: 'body' },
  { english: 'Eye', swahili: 'Jicho', kikuyu: 'Ĩthĩ', phonetic: 'Eethee', category: 'body' },
  { english: 'Hand', swahili: 'Mkono', kikuyu: 'Guoko', phonetic: 'Gwoko', category: 'body' },
  { english: 'Leg', swahili: 'Mguu', kikuyu: 'Kũgũrũ', phonetic: 'Koogooroo', category: 'body' },
  { english: 'Heart', swahili: 'Moyo', kikuyu: 'Ngoro', phonetic: 'Ngoro', category: 'body' },

  // --- NATURE ---
  { english: 'Sun', swahili: 'Jua', kikuyu: 'Rũũa', phonetic: 'Rooua', category: 'nature' },
  { english: 'Rain', swahili: 'Mvua', kikuyu: 'Mbura', phonetic: 'Mboora', category: 'nature' },
  { english: 'Tree', swahili: 'Mti', kikuyu: 'Mũtĩ', phonetic: 'Mootee', category: 'nature' },
  { english: 'River', swahili: 'Mto', kikuyu: 'Rũũĩ', phonetic: 'Rooui', category: 'nature' },
  { english: 'Mountain', swahili: 'Mlima', kikuyu: 'Kĩrĩma', phonetic: 'Keereema', category: 'nature' },
  { english: 'Fire', swahili: 'Moto', kikuyu: 'Mwaki', phonetic: 'Mwaki', category: 'nature' },
  { english: 'Land / Earth', swahili: 'Ardhi', kikuyu: 'Mũgũnda', phonetic: 'Moogoonda', category: 'nature' },
];

// Helper: get all categories
export const getCategories = (): string[] => {
  return [...new Set(kikuyuDictionary.map(e => e.category))];
};

// Helper: search dictionary
export const searchDictionary = (query: string): DictionaryEntry[] => {
  const q = query.toLowerCase().trim();
  return kikuyuDictionary.filter(e =>
    e.english.toLowerCase().includes(q) ||
    e.kikuyu.toLowerCase().includes(q) ||
    e.swahili.toLowerCase().includes(q) ||
    e.phonetic.toLowerCase().includes(q)
  );
};

// Helper: get by category
export const getByCategory = (category: string): DictionaryEntry[] => {
  return kikuyuDictionary.filter(e => e.category === category);
};

// Helper: lookup for translation fallback
export const lookupEnglish = (text: string): DictionaryEntry | null => {
  const q = text.toLowerCase().trim();
  return kikuyuDictionary.find(e => e.english.toLowerCase() === q) || null;
};
