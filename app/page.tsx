'use client';  


import { useState } from 'react';

export default function TranslatorApp() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en'); 

  // --- TRANSLATION LOGIC ---
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setOutputText('Translating with Gemini...'); 
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, sourceLang }), 
      });

      const data = await response.json();

      if (!response.ok) {
        setOutputText(`❌ Error: ${data.error}`);
        setIsTranslating(false);
        return;
      }
      
      setOutputText(data.translation);
    } catch (error) {
      setOutputText('❌ Critical Network Error: Could not reach the API route.');
    } finally {
      setIsTranslating(false);
    }
  };

  // --- SPEECH TO TEXT LOGIC ---
  const handleStartRecording = () => {
    // Check if the browser supports the Web Speech API
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please try using Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    
    // Set language based on dropdown (en-US for English, sw-KE for Kiswahili)
    recognition.lang = sourceLang === 'sw' ? 'sw-KE' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Append the spoken text to whatever is already in the box
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
  };

  // --- UI UTILS ---
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
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
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Gikuyu Transcribe</h1>
        </div>
        <nav>
          <a href="#discover" className="text-sm font-medium text-slate-300 hover:text-white hover:underline underline-offset-4 transition-all">
            Discover
          </a>
        </nav>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 min-h-[calc(100vh-64px)]">
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
                placeholder="Type or speak to translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                aria-label="Input text for translation"
                data-grammarly="false"
              ></textarea>
            </div>
            
            {/* Input Footer: Microphone */}
            <div className="p-4 flex items-center">
              <button 
                type="button" 
                onClick={handleStartRecording}
                title="Record Audio"
                className={`p-4 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-red-500/30 flex items-center gap-3 ${
                  isRecording 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                }`} 
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
                {isRecording && <span className="text-sm font-medium pr-2">Listening...</span>}
              </button>
            </div>
          </section>

          {/* Action Button Center */}
          <div className="z-10 -my-8 lg:my-0 flex items-center justify-center lg:px-2">
            <button 
              onClick={handleTranslate}
              disabled={isTranslating}
              className={`group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-900/30 hover:shadow-blue-700/40 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50 border border-blue-400/20 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2 ${isTranslating ? 'cursor-wait' : ''}`}
            >
              {isTranslating ? 'Translating...' : 'Translate'}
              {!isTranslating && (
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              )}
            </button>
          </div>

          {/* Output Card */}
          <section className="w-full lg:flex-1 bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col min-h-[400px]">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <span className="px-4 py-1.5 text-sm font-bold text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/20">Gikuyu</span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Gemini AI
              </span>
            </div>
            <div className="flex-grow p-6 bg-slate-950/20 rounded-b-3xl">
              <textarea 
                className="w-full h-full border-none bg-transparent focus:ring-0 text-xl text-slate-100 resize-none outline-none leading-relaxed" 
                readOnly 
                value={outputText}
                placeholder="Translation will appear here..."
                aria-label="Translated output in Gikuyu"
                data-grammarly="false"
              ></textarea>
            </div>
            
            {/* Output Footer: Copy Button */}
            <div className="p-4 flex items-center justify-end absolute bottom-0 right-0 w-full lg:w-1/2">
              <button 
                type="button" 
                title="Copy to clipboard"
                onClick={handleCopy}
                className={`p-4 rounded-full mr-4 mb-4 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg ${isCopied ? 'bg-green-500 text-white shadow-green-900/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'}`} 
              >
                {isCopied ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                )}
              </button>
            </div>
          </section>

        </div>

        {/* App Footer Info */}
        <footer className="mt-16 text-slate-500 text-sm text-center">
          <p>&copy; 2026 Gikuyu Transcribe. Built for cultural connection.</p>
        </footer>
      </main>
    </div>
  );
}