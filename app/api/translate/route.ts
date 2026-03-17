import { NextResponse } from 'next/server';
import { searchDictionary } from '@/lib/kikuyu-dictionary';

function findDemoTranslation(text: string): string | null {
  const results = searchDictionary(text);
  return results.length > 0 ? results[0].phonetic : null;
}

// Phonetic conversion for better TTS pronunciation
function phoneticConvert(text: string): string {
  return text
    // vowels
    .replace(/ĩ/g, 'ee')
    .replace(/ũ/g, 'oo')
    // consonant tuning
    .replace(/mw/g, 'mwe')
    .replace(/ng'/g, 'ng')
    .replace(/ny/g, 'ni')
    .replace(/th/g, 'th') // keep but emphasize
    // smoothing
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'e')
    .replace(/oo/g, 'o')
    // spacing fix
    .replace(/\s+/g, ' ')
    .trim();
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
        content: `You are a native Kikuyu radio presenter from Central Kenya. 
Translate the following Kiswahili text into natural spoken Kikuyu.

Rules:
- Speak like a Kikuyu radio presenter — warm, clear, and engaging
- Reorder sentences to sound natural in Kikuyu, not English structure
- Avoid copying English or Swahili sentence order
- Use conversational tone that feels natural to Kikuyu listeners
- Keep it short and punchy
- Only return the Kikuyu translation, nothing else

Text:
${text}`
      }],
      temperature: 0.5,
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