"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { APP_NAME } from "./constants";

export type UserProfile = {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
};

export type SavedPhrase = {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  dateSaved: string;
};

export type AppPreferences = {
  appLanguage: string;
  defaultTargetLanguage: string;
};

type StoreContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  savedPhrases: SavedPhrase[];
  addSavedPhrase: (phrase: Omit<SavedPhrase, "id" | "dateSaved">) => void;
  removeSavedPhrase: (id: string) => void;
  preferences: AppPreferences;
  setPreferences: (prefs: AppPreferences) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const brandDomain = APP_NAME.toLowerCase().replace(/\s+/g, "");
  const storagePrefix = brandDomain + "_";

  const [profile, setProfileState] = useState<UserProfile>({
    name: "Demo User",
    email: `demo@${brandDomain}.com`,
    bio: "",
    avatarUrl: "",
  });

  const [savedPhrases, setSavedPhrasesState] = useState<SavedPhrase[]>([]);

  const [preferences, setPreferencesState] = useState<AppPreferences>({
    appLanguage: "English",
    defaultTargetLanguage: "Gikuyu",
  });

  const [mounted, setMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(`${storagePrefix}profile`);
    if (savedProfile) setProfileState(JSON.parse(savedProfile));

    const savedPhrases = localStorage.getItem(`${storagePrefix}phrases`);
    if (savedPhrases) setSavedPhrasesState(JSON.parse(savedPhrases));

    const savedPrefs = localStorage.getItem(`${storagePrefix}prefs`);
    if (savedPrefs) setPreferencesState(JSON.parse(savedPrefs));

    setMounted(true);
  }, [storagePrefix]);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    localStorage.setItem(`${storagePrefix}profile`, JSON.stringify(newProfile));
  };

  const addSavedPhrase = (phrase: Omit<SavedPhrase, "id" | "dateSaved">) => {
    const newPhrase: SavedPhrase = {
      ...phrase,
      id: Date.now().toString(),
      dateSaved: new Date().toISOString(),
    };
    const updated = [newPhrase, ...savedPhrases];
    setSavedPhrasesState(updated);
    localStorage.setItem(`${storagePrefix}phrases`, JSON.stringify(updated));
  };

  const removeSavedPhrase = (id: string) => {
    const updated = savedPhrases.filter((p) => p.id !== id);
    setSavedPhrasesState(updated);
    localStorage.setItem(`${storagePrefix}phrases`, JSON.stringify(updated));
  };

  const setPreferences = (newPrefs: AppPreferences) => {
    setPreferencesState(newPrefs);
    localStorage.setItem(`${storagePrefix}prefs`, JSON.stringify(newPrefs));
  };

  return (
    <StoreContext.Provider
      value={{
        profile,
        setProfile,
        savedPhrases,
        addSavedPhrase,
        removeSavedPhrase,
        preferences,
        setPreferences,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
