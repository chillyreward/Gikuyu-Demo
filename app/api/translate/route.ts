import { NextResponse } from 'next/server';
import { localTranslate, hasLocalTranslation } from '@/lib/localTranslate';
import { searchPhrases, phoneticConvert } from '@/lib/kikuyuPhrases';
import { getCached, setCached } from '@/lib/translationCache';
import { audioLibrary, phraseDictionary } from '@/lib/dictionary';

function findLocalTranslation(text: string): string | null {
  if (hasLocalTranslation(text)) return localTranslate(text);
  const results = searchPhrases(text);
  return results.length > 0 ? phoneticConvert(results[0].kikuyu) : null;
}

async function translateToKikuyuDirect(text: string, sourceLang: string, apiKey: string): Promise<{ kikuyu: string; swahili: string }> {
  // Single OpenAI call: English → Kikuyu directly, return swahili as empty if not needed
  const isSwahili = sourceLang === 'sw';

  const prompt = isSwahili
    ? `You are a native Kikuyu radio presenter. Translate this Kiswahili text to natural spoken Kikuyu. Return only the Kikuyu translation.\n\n${text}`
    : `You are a native Kikuyu radio presenter. Translate this English text to natural spoken Kikuyu. Return only the Kikuyu translation.\n\n${text}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Translation failed');
  const kikuyu = data.choices[0].message.content.trim();
  return { kikuyu, swahili: '' };
}

export async function POST(request: Request) {
  try {
    const { text, sourceLang } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    // 1. Check audio library — serve pre-recorded file path
    const audioPath = audioLibrary[text.toLowerCase()];
    if (audioPath) {
      const kikuyuText = phraseDictionary[text.toLowerCase()] ?? text;
      return NextResponse.json({ translation: kikuyuText, audioUrl: audioPath });
    }

    // 2. Check cache
    const cached = getCached(text);
    if (cached) return NextResponse.json({ translation: cached, cached: true });

    // 2. Try local library
    const local = findLocalTranslation(text);
    if (local) {
      setCached(text, local);
      return NextResponse.json({ translation: local });
    }

    if (!apiKey) {
      return NextResponse.json({
        error: 'Missing OPENAI_API_KEY. Add known phrases to the local library for offline use.'
      }, { status: 500 });
    }

    // 3. Single API call: direct to Kikuyu
    const { kikuyu, swahili } = await translateToKikuyuDirect(text, sourceLang, apiKey);
    const phonetic = phoneticConvert(kikuyu);

    setCached(text, phonetic);
    return NextResponse.json({ translation: phonetic, kikuyu, swahili });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}
