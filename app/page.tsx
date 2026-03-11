'use client';

import { useState } from 'react';

export default function TranslatorApp() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en'); // Track the dropdown choice

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setOutputText('Translating...'); 
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send both the text AND the chosen language to the backend
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

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* Main Header */}
      <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Gikuyu Transcribe</h1>
        </div>
        <nav>
          <a href="#discover" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Discover
          </a>
        </nav>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-4 relative">
          
          {/* Input Card */}
          <section className="w-full lg:flex-1 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-slate-800/60 flex items-center">
              <label htmlFor="source-language" className="sr-only">Source Language</label>
              <select 
                id="source-language" 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-transparent border-none text-slate-300 font-medium focus:ring-0 cursor-pointer text-sm outline-none"
              >
                <option value="en" className="bg-slate-800">English</option>
                <option value="sw" className="bg-slate-800">Kiswahili</option>
              </select>
            </div>
            <div className="flex-grow p-6">
              <textarea 
                className="w-full h-full border-none bg-transparent focus:ring-0 text-lg text-slate-100 placeholder-slate-500 resize-none outline-none" 
                placeholder="Type text to translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                aria-label="Input text for translation"
                data-grammarly="false"
              ></textarea>
            </div>
            <div className="p-4 flex items-center">
              <button 
                type="button" 
                title="Record Audio"
                className="p-3 rounded-full bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </button>
            </div>
          </section>

          {/* Action Button Center */}
          <div className="z-10 -my-4 lg:my-0 flex-shrink-0">
            <button 
              onClick={handleTranslate}
              disabled={isTranslating}
              className={`bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:hover:scale-100 ${isTranslating ? 'cursor-wait' : ''}`}
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>

          {/* Output Card */}
          <section className="w-full lg:flex-1 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
              <span className="px-4 py-1 text-sm font-semibold text-slate-300">Gikuyu</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">AI Result</span>
            </div>
            <div className="flex-grow p-6 bg-slate-800/20 rounded-b-2xl">
              <textarea 
                className="w-full h-full border-none bg-transparent focus:ring-0 text-lg text-slate-100 resize-none outline-none" 
                readOnly 
                value={outputText}
                placeholder="Translation will appear here..."
                aria-label="Translated output in Gikuyu"
                data-grammarly="false"
              ></textarea>
            </div>
            <div className="p-4 flex items-center justify-end absolute bottom-0 right-0 w-full lg:w-1/2">
              <button 
                type="button" 
                title="Copy to clipboard"
                onClick={handleCopy}
                className={`p-3 rounded-full mr-4 mb-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isCopied ? 'bg-green-900/30 text-green-400' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-blue-400'}`} 
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                </svg>
              </button>
            </div>
          </section>

        </div>

        {/* App Footer Info */}
        <footer className="mt-12 text-slate-500 text-sm text-center">
          <p>&copy; 2026 Gikuyu Transcribe. Built for cultural connection.</p>
        </footer>
      </main>
    </div>
  );
}