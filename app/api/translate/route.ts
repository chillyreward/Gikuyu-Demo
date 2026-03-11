import { NextResponse } from 'next/server';
import { v2 } from '@google-cloud/translate';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    // Safety check: Are the environment variables even loading?
    if (!process.env.GOOGLE_PROJECT_ID || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({ error: 'Missing API keys in .env.local file' }, { status: 500 });
    }

    const translate = new v2.Translate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });

    const targetLanguage = 'ki'; 
    const [translation] = await translate.translate(text, targetLanguage);
    
    return NextResponse.json({ translation });
  } catch (error: any) {
    // Send the EXACT Google error back to the frontend
    return NextResponse.json({ error: error.message || 'Unknown Google Cloud error' }, { status: 500 });
  }
}