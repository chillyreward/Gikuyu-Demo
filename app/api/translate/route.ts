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

    const languageName = sourceLang === 'sw' ? 'Kiswahili' : 'English';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a native Kikuyu speaker from Central Kenya. Translate the given text into natural, everyday Kikuyu.

Rules:
- Use natural Kikuyu as spoken in Central Kenya
- Keep sentences short and clear
- Avoid literal word-for-word translation
- Preserve the meaning, not the exact words
- Use common everyday Kikuyu that people actually speak
- Only return the translated text, nothing else. No quotes, no explanations.`
          },
          {
            role: 'user',
            content: `Translate the following ${languageName} text into Kikuyu: "${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to reach OpenAI API');
    }

    const translation = data.choices[0].message.content.trim();
    return NextResponse.json({ translation });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}