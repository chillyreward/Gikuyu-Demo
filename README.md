# Kikuyu Text-to-Speech App

A Next.js application that translates English or Kiswahili text to Kikuyu (Gikuyu) and speaks it aloud. Features multiple AI-powered pipelines for translation and speech synthesis.

## Features

### 🎙️ Multiple Input Methods
- **Text Input**: Type or paste text directly
- **Speech-to-Text**: Record audio using Whisper API or browser speech recognition
- **YouTube Pipeline**: Process YouTube videos (download → transcribe → translate → speak)

### 🔄 Translation
- Gemini API for AI-powered translation
- Demo mode with pre-translated common phrases
- Supports English and Kiswahili to Kikuyu translation

### 🔊 Text-to-Speech
- ElevenLabs API for high-quality voice synthesis
- Browser Web Speech API as fallback
- Toggle between engines on-the-fly

### 📺 YouTube Pipeline
1. Download audio from YouTube using yt-dlp
2. Transcribe to English using OpenAI Whisper
3. Translate to Kikuyu using Gemini
4. Speak in Kikuyu using ElevenLabs or browser speech

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- yt-dlp (for YouTube feature)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gikuyu-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
USE_DEMO_MODE=true
```

4. Install yt-dlp (for YouTube feature):
```bash
# Windows (using winget)
winget install yt-dlp

# Or download from: https://github.com/yt-dlp/yt-dlp/releases
```

### API Keys

- **Gemini API**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **OpenAI API**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **ElevenLabs API**: Get from [ElevenLabs](https://elevenlabs.io/)

### Demo Mode

Set `USE_DEMO_MODE=true` to use pre-translated phrases without API keys. Try phrases like:
- "hello" → "Wĩ mwega"
- "thank you" → "Nĩ wega mũno"
- "good morning" → "Ũrĩa mwega rũciinĩ"

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)

3. Choose your input method:
   - Type text in the left panel
   - Click microphone to record speech
   - Click YouTube icon to process a video

4. Click "Speak in Kikuyu" to translate and hear the result

5. Toggle between speech engines using the buttons in the output panel

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Translation**: Google Gemini API
- **Speech Recognition**: OpenAI Whisper API / Browser Web Speech API
- **Text-to-Speech**: ElevenLabs API / Browser Web Speech API
- **YouTube Processing**: yt-dlp + Whisper

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── speak/          # ElevenLabs TTS endpoint
│   │   ├── transcribe/     # Whisper STT endpoint
│   │   ├── translate/      # Gemini translation endpoint
│   │   └── youtube-transcript/  # YouTube processing endpoint
│   ├── page.tsx            # Main UI component
│   └── layout.tsx          # App layout
├── .env.local              # Environment variables (not committed)
└── README.md
```

## Features in Detail

### Translation Pipeline
- Uses Gemini 1.5 Flash for fast, accurate translation
- Fallback to demo translations for common phrases
- Supports English and Kiswahili as source languages

### Speech Recognition
- **Whisper Mode**: Records audio and sends to OpenAI Whisper API
- **Browser Mode**: Uses built-in Web Speech API (Chrome recommended)
- Toggle between modes with the button in the input panel

### Text-to-Speech
- **ElevenLabs Mode**: High-quality neural voice synthesis
- **Browser Mode**: Free, built-in speech synthesis
- Automatic fallback if ElevenLabs fails

### YouTube Processing
1. Paste any YouTube URL
2. App downloads audio using yt-dlp
3. Transcribes to English using Whisper
4. Translates to Kikuyu using Gemini
5. Speaks the Kikuyu translation

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
