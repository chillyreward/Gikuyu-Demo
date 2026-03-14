'use client';

import { useState } from 'react';

export default function TranslatorApp() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [useWhisper, setUseWhisper] = useState(true);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null); 

  // --- YOUTUBE PIPELINE ---
  const handleYoutubeProcess = async () => {
    if (!youtubeUrl.trim()) return;
    
    setIsProcessingVideo(true);
    setInputText('');
    setTranslatedText('Processing YouTube video...');
    
    try {
      // Step 1: Get transcript from YouTube
      setTranslatedText('📥 Downloading and transcribing YouTube audio...');
      const transcriptResponse = await fetch('/api/youtube-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl }),
      });

      const transcriptData = await transcriptResponse.json();

      if (!transcriptResponse.ok) {
        setTranslatedText(`❌ Error: ${transcriptData.error}`);
        setIsProcessingYoutube(false);
        return;
      }

      const transcript = transcriptData.transcript;
      setInputText(transcript);
      
      // Step 2: Translate to Kikuyu
      setTranslatedText('🔄 Translating to Kikuyu...');
      const translateResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript, sourceLang: 'en' }),
      });

      const translateData = await translateResponse.json();

      if (!translateResponse.ok) {
        setTranslatedText(`❌ Translation Error: ${translateData.error}`);
        setIsProcessingYoutube(false);
        return;
      }

      const kikuyuText = translateData.translation;
      setTranslatedText(kikuyuText);
      setIsProcessingYoutube(false);
      
      // Step 3: Speak in Kikuyu
      if (useElevenLabs) {
        await speakWithElevenLabs(kikuyuText);
      } else {
        speakWithBrowser(kikuyuText);
      }
      
    } catch (error: any) {
      setTranslatedText(`❌ Error: ${error.message}`);
      setIsProcessingVideo(false);
    }
  };

  // --- TRANSLATE TO KIKUYU THEN SPEAK ---
  const handleSpeak = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    setTranslatedText('Translating to Kikuyu...');
    
    try {
      // First, translate to Kikuyu using Gemini
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, sourceLang }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTranslatedText(`❌ Error: ${data.error}`);
        setIsTranslating(false);
        return;
      }
      
      const kikuyuText = data.translation;
      setTranslatedText(kikuyuText);
      setIsTranslating(false);
      
      // Then speak the Kikuyu text
      if (useElevenLabs) {
        await speakWithElevenLabs(kikuyuText);
      } else {
        speakWithBrowser(kikuyuText);
      }
      
    } catch (error) {
      setTranslatedText('❌ Network Error: Could not reach the API.');
      setIsTranslating(false);
    }
  };

  // Speak using ElevenLabs API
  const speakWithElevenLabs = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        // Fallback to browser speech if ElevenLabs fails
        speakWithBrowser(text);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        // Fallback to browser speech
        speakWithBrowser(text);
      };
      
      await audio.play();
      
    } catch (error) {
      setIsSpeaking(false);
      // Fallback to browser speech
      speakWithBrowser(text);
    }
  };

  // Fallback: Speak using browser's Web Speech API
  const speakWithBrowser = (text: string) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-KE';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // --- SPEECH TO TEXT LOGIC ---
  const handleStartRecording = async () => {
    if (useWhisper) {
      // Use Whisper API for better accuracy
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // Convert to proper audio format and send to Whisper
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language', sourceLang);

          setIsRecording(false);
          setInputText('Transcribing with Whisper...');

          try {
            const response = await fetch('/api/transcribe', {
              method: 'POST',
              body: formData
            });

            const data = await response.json();

            if (!response.ok) {
              setInputText(`❌ Error: ${data.error}`);
              return;
            }

            setInputText((prev) => prev === 'Transcribing with Whisper...' ? data.transcript : prev + ' ' + data.transcript);
          } catch (error) {
            setInputText('❌ Transcription failed');
          }

          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        alert('Microphone access denied or not available');
      }
    } else {
      // Use browser's built-in speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert("Your browser does not support Speech Recognition. Please try using Google Chrome.");
        return;
      }

      const recognition = new SpeechRecognition();
      
      recognition.lang = sourceLang === 'sw' ? 'sw-KE' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => prev ? prev + ' ' + transcript : transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  // --- UI UTILS ---
  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleSpeechEngine = () => {
    setUseElevenLabs(!useElevenLabs);
  };

  const toggleRecognitionEngine = () => {
    setUseWhisper(!useWhisper);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans text-slate-100 selection:bg-blue-500/30">
      
      {/* Main Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800/60 h-16 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 ring-1 ring-white/10">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Kikuyu Text to Speech</h1>
        </div>
        <nav>
          <a href="#discover" className="text-sm font-medium text-slate-300 hover:text-white hover:underline underline-offset-4 transition-all">
            Discover
          </a>
        </nav>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 min-h-[calc(100vh-64px)]">
        
        {/* YouTube Input Section */}
        <div className="w-full max-w-4xl mx-auto mb-6">
          <button
            onClick={() => setShowYoutubeInput(!showYoutubeInput)}
            className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="font-semibold text-slate-200">YouTube Video Pipeline</span>
            </div>
            <svg className={`w-5 h-5 text-slate-400 transition-transform ${showYoutubeInput ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {showYoutubeInput && (
            <div className="mt-4 bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleYoutubeProcess}
                  disabled={isProcessingVideo || !youtubeUrl.trim()}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessingVideo ? 'Processing...' : 'Process'}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Pipeline: Download audio → Transcribe → Translate to Kikuyu → Speak
              </p>
            </div>
          )}
        </div>

        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 relative">
          
          {/* Input Card */}
          <section className="w-full lg:flex-1 bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col min-h-[400px] transition-all focus-within:border-blue-500/50 focus-within:shadow-blue-900/20">
            <div className="p-5 border-b border-slate-800/80 flex items-center">
              <label htmlFor="source-language" className="sr-only">Source Language</label>
              <select 
                id="source-language" 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm outline-none transition-all"
              >
                <option value="en" className="bg-slate-900">English</option>
                <option value="sw" className="bg-slate-900">Kiswahili</option>
              </select>
            </div>
            <div className="flex-grow p-6">
              <textarea 
                className="w-full h-full border-none bg-transparent focus:ring-0 text-xl text-slate-100 placeholder-slate-600 resize-none outline-none leading-relaxed" 
                placeholder="Type or speak text to hear it spoken..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                aria-label="Input text for speech"
                data-grammarly="false"
              ></textarea>
            </div>
            
            {/* Input Footer: Microphone */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  title={isRecording ? "Stop Recording" : "Record Audio"}
                  className={`p-4 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-red-500/30 flex items-center gap-3 ${
                    isRecording 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                  }`} 
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                  </svg>
                  {isRecording && <span className="text-sm font-medium pr-2">Recording...</span>}
                </button>
              </div>
              
              <button
                onClick={toggleRecognitionEngine}
                className="text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
                title="Toggle speech recognition engine"
              >
                {useWhisper ? '🎙️ Whisper' : '🔊 Browser'}
              </button>
            </div>
          </section>

          {/* Action Button Center */}
          <div className="z-10 -my-8 lg:my-0 flex items-center justify-center lg:px-2 flex-col gap-3">
            <button 
              onClick={handleSpeak}
              disabled={isSpeaking || isTranslating}
              className={`group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-900/30 hover:shadow-blue-700/40 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50 border border-blue-400/20 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2 ${(isSpeaking || isTranslating) ? 'cursor-wait' : ''}`}
            >
              {isTranslating ? 'Translating...' : isSpeaking ? 'Speaking...' : 'Speak in Kikuyu'}
              {!isSpeaking && !isTranslating && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
              )}
            </button>
            {isSpeaking && (
              <button 
                onClick={handleStopSpeaking}
                className="bg-red-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:bg-red-700 transition-all focus:outline-none focus:ring-4 focus:ring-red-500/50"
              >
                Stop
              </button>
            )}
          </div>

          {/* Kikuyu Output Card */}
          <section className="w-full lg:flex-1 bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col min-h-[400px]">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <span className="px-4 py-1.5 text-sm font-bold text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/20">Kikuyu</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSpeechEngine}
                  className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
                  title="Toggle speech engine"
                >
                  {useElevenLabs ? '🎙️ ElevenLabs' : '🔊 Browser'}
                </button>
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                  {isSpeaking ? 'Playing' : 'Ready'}
                </span>
              </div>
            </div>
            <div className="flex-grow p-6 bg-slate-950/20 rounded-b-3xl flex flex-col">
              <textarea 
                className="w-full flex-grow border-none bg-transparent focus:ring-0 text-xl text-slate-100 resize-none outline-none leading-relaxed" 
                readOnly 
                value={translatedText}
                placeholder="Kikuyu translation will appear here..."
                aria-label="Translated text in Kikuyu"
                data-grammarly="false"
              ></textarea>
              {isSpeaking && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-12 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-16 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                  <div className="w-2 h-12 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '450ms'}}></div>
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '600ms'}}></div>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* App Footer Info */}
        <footer className="mt-16 text-slate-500 text-sm text-center">
          <p>&copy; 2026 Kikuyu Text to Speech. Built for cultural connection.</p>
        </footer>
      </main>
    </div>
  );
}