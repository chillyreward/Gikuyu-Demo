import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, sourceLang } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY in .env.local' }, { status: 500 });
    }

    // Determine the source language name for the prompt
    const languageName = sourceLang === 'sw' ? 'Kiswahili' : 'English';

    // Give Gemini strict instructions to act ONLY as a translator
    const prompt = `You are an expert linguist. Translate the following ${languageName} text into Gikuyu. Only return the final translated text. Do not include quotes, conversational filler, or explanations. Here is the text: "${text}"`;

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

    // Extract the text from Gemini's response
    const translation = data.candidates[0].content.parts[0].text.trim();
    
    return NextResponse.json({ translation });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: error.message || 'Unknown server error' }, { status: 500 });
  }
}