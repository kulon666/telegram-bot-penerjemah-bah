const COMMON = [
  "aku",
  "kowe",
  "koe",
  "sampeyan",
  "panjenengan",
  "ora",
  "ndak",
  "gak",
  "nggih",
  "iya",
  "piye",
  "piye kabare",
  "wes",
  "wis",
  "arep",
  "arepe",
  "mangan",
  "turu",
  "lungo",
  "bali",
  "kapan",
  "ngendi",
  "opo",
  "apa",
  "monggo",
  "mboten",
  "nopo",
  "kulo",
  "samangke",
];

export function isLikelyJavanese(text) {
  const t = String(text || "")
    .toLowerCase()
    .replace(/[^a-z\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return false;

  const words = new Set(t.split(" ").filter(Boolean));

  let hits = 0;
  for (const w of COMMON) {
    const key = w.includes(" ") ? null : w;
    if (key && words.has(key)) hits += 1;
    if (!key && t.includes(w)) hits += 1;
  }

  // Very rough heuristic: 2+ common tokens suggests Javanese.
  return hits >= 2;
}
