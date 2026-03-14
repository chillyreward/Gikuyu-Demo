import { NextResponse } from 'next/server';

// Example Kikuyu translations dataset
const demoTranslations: Record<string, string> = {
  // English greetings
  'hello': 'Wĩ mwega',
  'good morning': 'Ũrĩa mwega rũciinĩ',
  'good afternoon': 'Ũrĩa mwega mũthenya',
  'good evening': 'Ũrĩa mwega hwaĩ-inĩ',
  'good night': 'Ũrĩa mwega ũtukũ',
  'how are you': 'Wĩ mwega atĩa',
  'thank you': 'Nĩ wega mũno',
  'welcome': 'Wĩ mwega',
  'goodbye': 'Tigwo na thayũ',
  
  // Common phrases
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
  
  // Kiswahili greetings
  'habari': 'Wĩ mwega atĩa',
  'asante': 'Nĩ wega mũno',
  'karibu': 'Wĩ mwega',
  'kwaheri': 'Tigwo na thayũ',
};

function findDemoTranslation(text: string): string | null {
  const normalizedText = text.toLowerCase().trim();
  
  // Exact match
  if (demoTranslations[normalizedText]) {
    return demoTranslations[normalizedText];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(demoTranslations)) {
    if (normalizedText.includes(key) || key.includes(normalizedText)) {
      return value;
    }
  }
  
  return null;
}

export async function POST(request: Request) {
  try {
    const { text, sourceLang } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const useDemoMode = process.env.USE_DEMO_MODE === 'true';
    
    // Try demo mode first if enabled
    if (useDemoMode) {
      const demoTranslation = findDemoTranslation(text);
      if (demoTranslation) {
        return NextResponse.json({ translation: demoTranslation });
      }
    }
    
    // Fall back to Gemini API
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Missing GEMINI_API_KEY in .env.local. Set USE_DEMO_MODE=true to use example data.' 
      }, { status: 500 });
    }

    const languageName = sourceLang === 'sw' ? 'Kiswahili' : 'English';
    const prompt = `You are an expert linguist. Translate the following ${languageName} text into Kikuyu (Gikuyu). Only return the final translated text. Do not include quotes, conversational filler, or explanations. Here is the text: "${text}"`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to reach Gemini API');
    }

    const translation = data.candidates[0].content.parts[0].text.trim();
    
    return NextResponse.json({ translation });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}