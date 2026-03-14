import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { youtubeUrl } = await request.json();
    
    if (!youtubeUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    // Create temp directory for audio files
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const audioPath = path.join(tempDir, `audio_${timestamp}.mp3`);

    // Step 1: Download audio using yt-dlp
    console.log('Downloading audio from YouTube...');
    await execAsync(`yt-dlp -x --audio-format mp3 -o "${audioPath}" "${youtubeUrl}"`);

    if (!fs.existsSync(audioPath)) {
      throw new Error('Failed to download audio');
    }

    // Step 2: Transcribe audio using OpenAI Whisper API
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      // Clean up
      fs.unlinkSync(audioPath);
      return NextResponse.json({ 
        error: 'Missing OPENAI_API_KEY for transcription' 
      }, { status: 500 });
    }

    console.log('Transcribing audio with Whisper...');
    const formData = new FormData();
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`
      },
      body: formData
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.json();
      throw new Error(error.error?.message || 'Transcription failed');
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcript = transcriptionData.text;

    // Clean up audio file
    fs.unlinkSync(audioPath);

    return NextResponse.json({ 
      transcript,
      message: 'Transcription complete'
    });

  } catch (error: any) {
    console.error('YouTube transcript error:', error);
    return NextResponse.json({ 
      error: error.message || 'Unknown server error' 
    }, { status: 500 });
  }
}
