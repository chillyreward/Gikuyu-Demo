import { NextResponse } from 'next/server';

// Example Kikuyu translations dataset
const demoTranslations: Record<string, string> = {
  'hello': 'Wĩ mwega',
  'good morning': 'Ũrĩa mwega rũciinĩ',
  'good afternoon': 'Ũrĩa mwega mũthenya',
  'good evening': 'Ũrĩa mwega hwaĩ-inĩ',
  'good night': 'Ũrĩa mwega ũtukũ',
  'how are you': 'Wĩ mwega atĩa',
  'thank you': 'Nĩ wega mũno',
  'welcome': 'Wĩ mwega',
  'goodbye': 'Tigwo na thayũ',
  'yes': 'Ĩĩ',
  'no': 'Aca',
  'please': 'Ndagũthaitha',
  'sorry': 'Ndĩ na ũũru',
  'excuse me': 'Ndĩ na ũũru',
  'i love you': 'Nĩngwendete',
  'what is your name': 'Wĩtagwo atĩa',
  'my name is': 'Ndĩĩtagwo',
  'how much': 'Nĩ thogora ũrĩkũ',
  'water': 'Maaĩ',
  'food': 'Irio',
  'help': 'Ndeithia',
  'habari': 'Wĩ mwega atĩa',
  'asante': 'Nĩ wega mũno',
  'karibu': 'Wĩ mwega',
  'kwaheri': 'Tigwo na thayũ',
};

function findDemoTranslation(text: string): string | null {
  const normalizedText = text.toLowerCase().trim();
  if (demoTranslations[normalizedText]) return demoTranslations[normalizedText];
  for (const [key, value] of Object.entries(demoTranslations)) {
    if (normalizedText.includes(key) || key.includes(normalizedText)) return value;
  }
  return null;
}

// Phonetic conversion for better TTS pronunciation
function phoneticConvert(text: string): string {
  return text
    .replace(/ĩ/g, 'ee')
    .replace(/ũ/g, 'oo')
    .replace(/ng'/g, 'ng')
    .replace(/c/g, 'ch');
}

async function translateToSwahili(text: string, sourceLang: string, apiKey: string): Promise<string> {
  // If already Swahili, skip this step
  if (sourceLang === 'sw') return text;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: `Translate this text to Kiswahili:\n${text}` }],
      temperature: 0.3,
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Swahili translation failed');
  return data.choices[0].message.content.trim();
}

async function translateToKikuyu(text: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [{
        role: 'user',
        content: `Translate this Kiswahili text into natural Kikuyu.
Rules:
- Use simple, spoken Kikuyu from Central Kenya
- Keep sentences short
- Avoid literal translation
- Preserve meaning

Text:
${text}`
      }],
      temperature: 0.3,
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Kikuyu translation failed');
  return data.choices[0].message.content.trim();
}

export async function POST(request: Request) {
  try {
    const { text, sourceLang } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const useDemoMode = process.env.USE_DEMO_MODE === 'true';

    // Try demo mode first
    if (useDemoMode) {
      const demoTranslation = findDemoTranslation(text);
      if (demoTranslation) return NextResponse.json({ translation: demoTranslation });
    }

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Missing OPENAI_API_KEY in .env.local. Set USE_DEMO_MODE=true to use example data.' 
      }, { status: 500 });
    }

    // Step 1: Translate to Swahili (bridge language)
    const swahili = await translateToSwahili(text, sourceLang, apiKey);

    // Step 2: Translate Swahili → Kikuyu
    const kikuyu = await translateToKikuyu(swahili, apiKey);

    // Step 3: Phonetic conversion for better TTS pronunciation
    const phonetic = phoneticConvert(kikuyu);

    return NextResponse.json({ translation: phonetic, kikuyu, swahili });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}