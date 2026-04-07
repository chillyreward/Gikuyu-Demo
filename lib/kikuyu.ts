export function restructure(text: string): string {
  // simple natural reordering — move "tafadhali" to end as a polite suffix
  return text.replace("tafadhali", "").trim() + ", nĩ, tafadhali";
}

export function addRhythm(text: string): string {
  return text
    .replace(/^/, "Nĩ, ")
    .replace(/,/g, ", ... ")
    .replace(/\./g, "... ")
    + " ... nĩwega";
}

export function kikuyuPhonetic(text: string): string {
  return text
    .replace(/ĩ/g, "i")
    .replace(/ũ/g, "u")
    .replace(/th/g, "dh")
    .replace(/ng'/g, "ng")
    .replace(/ny/g, "ni")
    .replace(/mw/g, "mwe")
    .toLowerCase();
}

export function splitChunks(text: string): string[] {
  return text.split(",").map(t => t.trim()).filter(Boolean);
}

export function applyProsody(text: string): string {
  return text
    .replace(/^/, "Ni, ")
    .replace(/,/g, ", ... ")
    + " ... niwega";
}
