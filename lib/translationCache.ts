/**
 * In-memory translation cache.
 * Keyed by lowercase input text — avoids repeat API calls for the same phrase.
 */
const cache = new Map<string, string>();

export function getCached(text: string): string | null {
  return cache.get(text.toLowerCase()) ?? null;
}

export function setCached(text: string, translation: string): void {
  cache.set(text.toLowerCase(), translation);
}
