import { NextResponse } from 'next/server';
import { localTranslate, hasLocalTranslation } from '@/lib/localTranslate';
import { searchPhrases, phoneticConvert } from '@/lib/kikuyuPhrases';

function findLocalTranslation(text: string): string | null {
  if (hasLocalTranslation(text)) return localTranslate(text);
  const results = searchPhrases(text);
  return results.length > 0 ? phoneticConvert(results[0].kikuyu) : null;
}

async function translateToSwahili(text: string, sourceLang: string, apiKey: string): Promise<string> {
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

    // Always try local library first
    const local = findLocalTranslation(text);
    if (local) return NextResponse.json({ translation: local });

    if (!apiKey) {
      return NextResponse.json({
        error: 'Missing OPENAI_API_KEY in .env.local. Add known phrases to the local library for offline use.'
      }, { status: 500 });
    }

    // Fall back to OpenAI
    const swahili = await translateToSwahili(text, sourceLang, apiKey);
    const kikuyu = await translateToKikuyu(swahili, apiKey);
    const phonetic = phoneticConvert(kikuyu);

    return NextResponse.json({ translation: phonetic, kikuyu, swahili });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}
