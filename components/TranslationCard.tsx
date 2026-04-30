"use client";

import { useState, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Copy,
  Share2,
  Bookmark,
  ArrowRightLeft,
  Volume2,
  History,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TARGET_LANGUAGES = ["Gikuyu"];
const SOURCE_LANGUAGES = ["Auto-detect", "English", "Kiswahili"];

type LoadingState = "idle" | "translating" | "listening" | "transcribing" | "speaking";

export function TranslationCard() {
  const { addSavedPhrase } = useStore();
  const [sourceLang, setSourceLang] = useState("Auto-detect");
  const targetLang = "Gikuyu";
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState(false);

  // Recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRecording = loadingState === "listening";

  const clearError = () => setError(null);

  // ─── Translate ────────────────────────────────────────────────────────────
  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) {
      setError("Please enter some text to translate.");
      return;
    }
    clearError();
    setLoadingState("translating");
    setTranslatedText("");
    setIsSaved(false);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, sourceLanguage: sourceLang }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Translation failed. Please try again.");
      }

      setTranslatedText(data.translation);

      // Play pre-recorded audio directly if available
      if (data.audioUrl) {
        setLoadingState("speaking");
        const audio = new Audio(data.audioUrl);
        audio.onended = () => setLoadingState("idle");
        audio.onerror = () => setLoadingState("idle");
        audio.play();
        return;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Translation failed.";
      setError(message);
    } finally {
      setLoadingState("idle");
    }
  }, [sourceText, sourceLang]);

  // ─── Voice Input (Mic) ────────────────────────────────────────────────────
  const handleMicClick = useCallback(async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      return;
    }

    clearError();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release the mic indicator
        stream.getTracks().forEach((track) => track.stop());
        setLoadingState("transcribing");

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Transcription failed.");
          }

          setSourceText(data.transcript ?? data.text);
          setIsSaved(false);
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Transcription failed.";
          setError(message);
        } finally {
          setLoadingState("idle");
        }
      };

      mediaRecorder.start();
      setLoadingState("listening");
    } catch {
      setError(
        "Microphone access was denied. Please allow microphone access and try again."
      );
      setLoadingState("idle");
    }
  }, [isRecording]);

  // ─── Text-to-Speech (Source) ──────────────────────────────────────────────
  const handleSpeakSource = useCallback(async () => {
    if (!sourceText.trim()) return;
    clearError();
    setLoadingState("speaking");

    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate audio.");
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      await audio.play();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate audio.";
      setError(message);
    } finally {
      setLoadingState("idle");
    }
  }, [sourceText]);

  // ─── Text-to-Speech (Translation) ────────────────────────────────────────
  const handleSpeakTranslation = useCallback(async () => {
    if (!translatedText.trim()) return;
    clearError();
    setLoadingState("speaking");

    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translatedText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate audio.");
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => URL.revokeObjectURL(audioUrl);
      await audio.play();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate audio.";
      setError(message);
    } finally {
      setLoadingState("idle");
    }
  }, [translatedText]);

  // ─── Save Phrase ──────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!translatedText || isSaved) return;
    addSavedPhrase({ sourceText, translatedText, sourceLang, targetLang });
    setIsSaved(true);
  };

  // ─── Copy ─────────────────────────────────────────────────────────────────
  const handleCopySource = () => {
    if (!sourceText) return;
    navigator.clipboard.writeText(sourceText);
    setCopiedSource(true);
    setTimeout(() => setCopiedSource(false), 2000);
  };

  const handleCopyTarget = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopiedTarget(true);
    setTimeout(() => setCopiedTarget(false), 2000);
  };

  // ─── Button label helpers ─────────────────────────────────────────────────
  const translateLabel =
    loadingState === "translating" ? "Translating..." : "Translate";

  const micLabel =
    loadingState === "listening"
      ? "Listening..."
      : loadingState === "transcribing"
      ? "Transcribing..."
      : "Voice Input";

  const isBusy = loadingState !== "idle";

  return (
    <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300">
      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 px-5 py-3 bg-red-50 dark:bg-red-950/40 border-b border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm animate-in fade-in duration-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 font-bold text-xs shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 relative">

        {/* Source Text Area */}
        <div className="flex-1 p-5 md:p-8 relative flex flex-col group transition-all">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex flex-wrap gap-1 md:gap-2">
              {SOURCE_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setSourceLang(lang); setIsSaved(false); }}
                  disabled={isBusy}
                  className={cn(
                    "px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all border",
                    sourceLang === lang
                      ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700",
                    isBusy && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="w-full flex-1 resize-none bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 text-xl md:text-2xl min-h-[180px] font-serif leading-relaxed selection:bg-primary-500/30 transition-colors"
            placeholder={
              loadingState === "transcribing"
                ? "Transcribing audio..."
                : "Type, paste, or speak text here..."
            }
            value={sourceText}
            onChange={(e) => {
              setSourceText(e.target.value);
              setIsSaved(false);
              clearError();
            }}
            disabled={isBusy}
          />

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-1 md:gap-2">
              {/* Mic Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMicClick}
                disabled={loadingState === "translating" || loadingState === "speaking" || loadingState === "transcribing"}
                title={micLabel}
                className={cn(
                  "rounded-xl h-10 w-10 transition-all",
                  isRecording
                    ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 animate-pulse"
                    : loadingState === "transcribing"
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                )}
              >
                {loadingState === "transcribing" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : isRecording ? (
                  <MicOff size={20} />
                ) : (
                  <Mic size={20} />
                )}
              </Button>

              {/* Speak source text */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeakSource}
                disabled={!sourceText.trim() || isBusy}
                title="Listen to source text"
                className={cn(
                  "rounded-xl h-10 w-10 transition-all",
                  loadingState === "speaking"
                    ? "text-primary-500 animate-pulse"
                    : "text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20",
                  (!sourceText.trim() || isBusy) && "opacity-40 cursor-not-allowed"
                )}
              >
                {loadingState === "speaking" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Volume2 size={20} />
                )}
              </Button>

              {/* Copy source */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopySource}
                disabled={!sourceText.trim()}
                title="Copy source text"
                className={cn(
                  "rounded-xl h-10 w-10 transition-all",
                  copiedSource
                    ? "text-green-500 dark:text-green-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100",
                  !sourceText.trim() && "opacity-40 cursor-not-allowed"
                )}
              >
                {copiedSource ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              </Button>
            </div>
            <p className="text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {sourceText.length} / 5000
            </p>
          </div>
        </div>

        {/* Swap Button - Disabled (target locked to Gikuyu) */}
        <div className="absolute left-1/2 top-[50%] md:top-14 -translate-x-1/2 -translate-y-1/2 z-20 md:flex">
          <button
            disabled
            className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 shadow-sm rounded-full p-3 cursor-not-allowed"
          >
            <ArrowRightLeft size={18} />
          </button>
        </div>

        {/* Translation Area */}
        <div className="flex-1 p-5 md:p-8 bg-slate-50/30 dark:bg-slate-950/30 relative flex flex-col group/result transition-all">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="text-[10px] md:text-xs font-bold text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full border border-primary-100 dark:border-primary-800/50 bg-primary-50/50 dark:bg-primary-900/20 uppercase tracking-widest flex items-center gap-2">
              Target: {targetLang}
            </div>
          </div>

          <div className="flex-1 text-xl md:text-2xl text-slate-900 dark:text-white min-h-[180px] font-serif leading-relaxed transition-colors">
            {loadingState === "translating" ? (
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
                <Loader2 size={22} className="animate-spin text-primary-500 shrink-0" />
                <span className="text-base font-sans">Translating...</span>
              </div>
            ) : translatedText ? (
              <p className="animate-in fade-in duration-500">{translatedText}</p>
            ) : (
              <div className="text-slate-300 dark:text-slate-700 transition-colors">
                <span className="font-medium text-slate-400 dark:text-slate-600">
                  Wĩ mwega?
                </span>
                <span className="block text-sm mt-1">How are you?</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-1 md:gap-2">
              {/* Speak translation */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeakTranslation}
                disabled={!translatedText.trim() || isBusy}
                title="Listen to translation"
                className={cn(
                  "rounded-xl h-10 w-10 transition-all",
                  loadingState === "speaking"
                    ? "text-primary-500 animate-pulse"
                    : "text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20",
                  (!translatedText.trim() || isBusy) && "opacity-40 cursor-not-allowed"
                )}
              >
                {loadingState === "speaking" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Volume2 size={20} />
                )}
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled
                title="Translation history (coming soon)"
                className="rounded-xl h-10 w-10 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
              >
                <History size={18} />
              </Button>

              {/* Save */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                disabled={!translatedText || isSaved}
                title={isSaved ? "Phrase saved!" : "Save phrase"}
                className={cn(
                  "rounded-xl h-10 w-10 transition-all",
                  isSaved
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100",
                  !translatedText && "opacity-40 cursor-not-allowed"
                )}
              >
                <Bookmark
                  size={18}
                  className={isSaved ? "fill-current" : ""}
                />
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (!translatedText) return;
                  if (navigator.share) {
                    navigator.share({ title: "Gikuyu Translation", text: translatedText });
                  }
                }}
                disabled={!translatedText}
                title="Share translation"
                className={cn(
                  "rounded-xl h-10 w-10 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all",
                  !translatedText && "opacity-40 cursor-not-allowed"
                )}
              >
                <Share2 size={18} />
              </Button>

              {/* Copy translation */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyTarget}
                disabled={!translatedText}
                title="Copy translation"
                className={cn(
                  "rounded-xl h-10 w-10 transition-all",
                  copiedTarget
                    ? "text-green-500 dark:text-green-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100",
                  !translatedText && "opacity-40 cursor-not-allowed"
                )}
              >
                {copiedTarget ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-5 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        {/* Recording status label */}
        <div className="text-xs text-slate-400 dark:text-slate-600 font-medium">
          {loadingState === "listening" && (
            <span className="flex items-center gap-2 text-red-500 dark:text-red-400 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              Recording… Click the mic again to stop.
            </span>
          )}
          {loadingState === "transcribing" && (
            <span className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
              <Loader2 size={13} className="animate-spin" />
              Transcribing audio…
            </span>
          )}
          {loadingState === "speaking" && (
            <span className="flex items-center gap-2 text-primary-500">
              <Loader2 size={13} className="animate-spin" />
              Generating audio…
            </span>
          )}
        </div>

        <Button
          onClick={handleTranslate}
          disabled={isBusy || !sourceText.trim()}
          className={cn(
            "w-full sm:w-auto px-10 h-12 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary-500/20 dark:shadow-primary-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]",
            (isBusy || !sourceText.trim()) && "opacity-60 cursor-not-allowed hover:scale-100"
          )}
        >
          {loadingState === "translating" ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2 inline" />
              Translating…
            </>
          ) : (
            "Translate"
          )}
        </Button>
      </div>
    </Card>
  );
}
