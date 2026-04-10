'use client';

import { useState } from 'react';

type TTSEngine = 'elevenlabs' | 'openai' | 'gooey' | 'browser';
type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

const OPENAI_VOICES: { value: OpenAIVoice; label: string; desc: string }[] = [
  { value: 'nova',    label: 'Nova',    desc: 'Warm, natural — best for Kikuyu' },
  { value: 'shimmer', label: 'Shimmer', desc: 'Soft, expressive female tone' },
  { value: 'fable',   label: 'Fable',   desc: 'Storytelling, rich cadence' },
  { value: 'alloy',   label: 'Alloy',   desc: 'Neutral, clear' },
  { value: 'echo',    label: 'Echo',    desc: 'Smooth male voice' },
  { value: 'onyx',    label: 'Onyx',    desc: 'Deep, authoritative' },
];

export default function TranslatorApp() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [inputText, setInputText] = useState('how many varieties of coffee are grown in kenya');
  const [translatedText, setTranslatedText] = useState('');
  const [swahiliText, setSwahiliText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [ttsEngine, setTtsEngine] = useState<TTSEngine>('gooey');
  const [openaiVoice, setOpenaiVoice] = useState<OpenAIVoice>('nova');
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [useWhisper, setUseWhisper] = useState(true);
  const [useKikuyuASR, setUseKikuyuASR] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // --- SPEAK DISPATCHER ---
  const speak = async (text: string) => {
    if (ttsEngine === 'browser') { speakWithBrowser(text); return; }
    await speakWithAPI(text);
  };

  const speakWithAPI = async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          engine: ttsEngine === 'openai' ? 'openai' : 'elevenlabs',
          voice: openaiVoice,
        }),
      });

      if (!response.ok) { speakWithBrowser(text); return; }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(audioUrl); };
      audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(audioUrl); speakWithBrowser(text); };
      await audio.play();
    } catch {
      setIsSpeaking(false);
      speakWithBrowser(text);
    }
  };

  const speakWithBrowser = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-KE';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- YOUTUBE PIPELINE ---
  const handleYoutubeProcess = async () => {
    if (!youtubeUrl.trim()) return;
    setIsProcessingVideo(true);
    setInputText('');
    setTranslatedText('📥 Downloading and transcribing YouTube audio...');

    try {
      const transcriptResponse = await fetch('/api/youtube-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl }),
      });
      const transcriptData = await transcriptResponse.json();
      if (!transcriptResponse.ok) { setTranslatedText(`❌ Error: ${transcriptData.error}`); setIsProcessingVideo(false); return; }

      const transcript = transcriptData.transcript;
      setInputText(transcript);
      setTranslatedText('🔄 Translating to Kikuyu...');

      const translateResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript, sourceLang: 'en' }),
      });
      const translateData = await translateResponse.json();
      if (!translateResponse.ok) { setTranslatedText(`❌ Translation Error: ${translateData.error}`); setIsProcessingVideo(false); return; }

      const kikuyuText = translateData.translation;
      setTranslatedText(kikuyuText);
      setIsProcessingVideo(false);
      await speak(kikuyuText);
    } catch (error: any) {
      setTranslatedText(`❌ Error: ${error.message}`);
      setIsProcessingVideo(false);
    }
  };

  // --- TRANSLATE + SPEAK ---
  const handleSpeak = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setTranslatedText('Translating to Kikuyu...');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, sourceLang }),
      });
      const data = await response.json();
      if (!response.ok) { setTranslatedText(`❌ Error: ${data.error}`); setIsTranslating(false); return; }

      const kikuyuText = data.translation;
      setSwahiliText(data.swahili || '');
      setTranslatedText(kikuyuText);
      setIsTranslating(false);

      // Play pre-recorded audio directly if available — no TTS fallback
      if (data.audioUrl) {
        setIsSpeaking(true);
        const audio = new Audio(data.audioUrl);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        audio.play();
        return;
      }

      await speak(kikuyuText);
    } catch {
      setTranslatedText('❌ Network Error: Could not reach the API.');
      setIsTranslating(false);
    }
  };

  // --- RECORDING ---
  const handleStartRecording = async () => {
    if (useKikuyuASR) {
      // Gooey Kikuyu ASR — fine-tuned whisper-kik model
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];
        recorder.ondataavailable = (e) => audioChunks.push(e.data);
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          setIsRecording(false);
          setInputText('Transcribing Kikuyu...');
          try {
            const response = await fetch('/api/transcribe-kikuyu', { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) { setInputText(`❌ Error: ${data.error}`); return; }
            setInputText(prev => prev === 'Transcribing Kikuyu...' ? data.transcript : prev + ' ' + data.transcript);
          } catch { setInputText('❌ Kikuyu transcription failed'); }
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch { alert('Microphone access denied or not available'); }
    } else if (useWhisper) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];
        recorder.ondataavailable = (e) => audioChunks.push(e.data);
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language', sourceLang);
          setIsRecording(false);
          setInputText('Transcribing with Whisper...');
          try {
            const response = await fetch('/api/transcribe', { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) { setInputText(`❌ Error: ${data.error}`); return; }
            setInputText(prev => prev === 'Transcribing with Whisper...' ? data.transcript : prev + ' ' + data.transcript);
          } catch { setInputText('❌ Transcription failed'); }
          stream.getTracks().forEach(t => t.stop());
        };
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch { alert('Microphone access denied or not available'); }
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) { alert('Your browser does not support Speech Recognition. Please try Google Chrome.'); return; }
      const recognition = new SpeechRecognition();
      recognition.lang = sourceLang === 'sw' ? 'sw-KE' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e: any) => setInputText(prev => prev ? prev + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder?.state === 'recording') mediaRecorder.stop();
    setIsRecording(false);
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const engineLabel = ttsEngine === 'elevenlabs' ? '🎙️ ElevenLabs' : ttsEngine === 'openai' ? '🤖 OpenAI' : ttsEngine === 'gooey' ? '🌍 Gooey' : '🔊 Browser';
  const cycleEngine = () => setTtsEngine(e => e === 'elevenlabs' ? 'openai' : e === 'openai' ? 'gooey' : e === 'gooey' ? 'browser' : 'elevenlabs');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans text-slate-100 selection:bg-blue-500/30">

      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800/60 h-16 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 ring-1 ring-white/10">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Kikuyu Text to Speech</h1>
        </div>
        <nav>
          <a href="#discover" className="text-sm font-medium text-slate-300 hover:text-white hover:underline underline-offset-4 transition-all">Discover</a>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 min-h-[calc(100vh-64px)]">

        {/* YouTube Section */}
        <div className="w-full max-w-4xl mx-auto mb-6">
          <button onClick={() => setShowYoutubeInput(!showYoutubeInput)}
            className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-between transition-all">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="font-semibold text-slate-200">YouTube Video Pipeline</span>
            </div>
            <svg className={`w-5 h-5 text-slate-400 transition-transform ${showYoutubeInput ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showYoutubeInput && (
            <div className="mt-4 bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex gap-3">
                <input type="text" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none" />
                <button onClick={handleYoutubeProcess} disabled={isProcessingVideo || !youtubeUrl.trim()}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {isProcessingVideo ? 'Processing...' : 'Process'}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">Pipeline: Download audio → Transcribe → Translate to Kikuyu → Speak</p>
            </div>
          )}
        </div>

        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 relative">

          {/* Input Card */}
          <section className="w-full lg:flex-1 bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col min-h-[400px] transition-all focus-within:border-blue-500/50">
            <div className="p-5 border-b border-slate-800/80 flex items-center">
              <label htmlFor="source-language" className="sr-only">Source Language</label>
              <select id="source-language" value={sourceLang} onChange={e => setSourceLang(e.target.value)}
                className="bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm outline-none transition-all">
                <option value="en" className="bg-slate-900">English</option>
                <option value="sw" className="bg-slate-900">Kiswahili</option>
              </select>
            </div>
            <div className="flex-grow p-6">
              <textarea className="w-full h-full border-none bg-transparent focus:ring-0 text-xl text-slate-100 placeholder-slate-600 resize-none outline-none leading-relaxed"
                placeholder="Type or speak text to hear it spoken..."
                value={inputText} onChange={e => setInputText(e.target.value)}
                readOnly
                aria-label="Input text for speech" data-grammarly="false" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <button type="button" onClick={isRecording ? handleStopRecording : handleStartRecording}
                title={isRecording ? 'Stop Recording' : 'Record Audio'}
                className={`p-4 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-red-500/30 flex items-center gap-3 ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'}`}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isRecording && <span className="text-sm font-medium pr-2">Recording...</span>}
              </button>
              <button onClick={() => {
                  if (!useWhisper && !useKikuyuASR) { setUseWhisper(true); setUseKikuyuASR(false); }
                  else if (useWhisper) { setUseWhisper(false); setUseKikuyuASR(true); }
                  else { setUseWhisper(false); setUseKikuyuASR(false); }
                }}
                className="text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
                {useKikuyuASR ? '🇰🇪 Kikuyu' : useWhisper ? '🎙️ Whisper' : '🔊 Browser'}
              </button>
            </div>
          </section>

          {/* Center Action */}
          <div className="z-10 -my-8 lg:my-0 flex items-center justify-center lg:px-2 flex-col gap-3">
            <button onClick={handleSpeak} disabled={isSpeaking || isTranslating}
              className={`group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-900/30 hover:shadow-blue-700/40 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50 border border-blue-400/20 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2 ${(isSpeaking || isTranslating) ? 'cursor-wait' : ''}`}>
              {isTranslating ? 'Translating...' : isSpeaking ? 'Speaking...' : 'Speak in Kikuyu'}
              {!isSpeaking && !isTranslating && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
            {isSpeaking && (
              <button onClick={handleStopSpeaking}
                className="bg-red-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:bg-red-700 transition-all focus:outline-none focus:ring-4 focus:ring-red-500/50">
                Stop
              </button>
            )}
          </div>

          {/* Output Card */}
          <section className="w-full lg:flex-1 bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col min-h-[400px]">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <span className="px-4 py-1.5 text-sm font-bold text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/20">Kikuyu</span>
              <div className="flex items-center gap-2">

                {/* Engine cycle button */}
                <button onClick={cycleEngine}
                  className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
                  title="Cycle TTS engine">
                  {engineLabel}
                </button>

                {/* Voice picker — only shown for OpenAI */}
                {ttsEngine === 'openai' && (
                  <div className="relative">
                    <button onClick={() => setShowVoicePicker(!showVoicePicker)}
                      className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700 transition-all flex items-center gap-1">
                      {openaiVoice}
                      <svg className={`w-3 h-3 transition-transform ${showVoicePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showVoicePicker && (
                      <div className="absolute right-0 top-8 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-56 overflow-hidden">
                        {OPENAI_VOICES.map(v => (
                          <button key={v.value}
                            onClick={() => { setOpenaiVoice(v.value); setShowVoicePicker(false); }}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-800 transition-all flex flex-col gap-0.5 ${openaiVoice === v.value ? 'bg-indigo-900/40 text-indigo-300' : 'text-slate-200'}`}>
                            <span className="text-sm font-medium">{v.label}</span>
                            <span className="text-[11px] text-slate-500">{v.desc}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                  {isSpeaking ? 'Playing' : 'Ready'}
                </span>
              </div>
            </div>
            <div className="flex-grow p-6 bg-slate-950/20 rounded-b-3xl flex flex-col gap-4">
              {swahiliText && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Swahili (bridge)</p>
                  <p className="text-sm text-slate-400 italic">{swahiliText}</p>
                </div>
              )}
              {swahiliText && translatedText && <div className="border-t border-slate-800" />}
              <textarea className="w-full flex-grow border-none bg-transparent focus:ring-0 text-xl text-slate-100 resize-none outline-none leading-relaxed"
                readOnly value={translatedText}
                placeholder="Kikuyu translation will appear here..."
                aria-label="Translated text in Kikuyu" data-grammarly="false" />
              {isSpeaking && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {[0, 150, 300, 450, 600].map((delay, i) => (
                    <div key={i} className={`w-2 bg-blue-500 rounded-full animate-pulse ${i === 2 ? 'h-16' : i === 1 || i === 3 ? 'h-12' : 'h-8'}`}
                      style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="mt-16 text-slate-500 text-sm text-center">
          <p>&copy; 2026 Kikuyu Text to Speech. Built for cultural connection.</p>
        </footer>
      </main>
    </div>
  );
}
