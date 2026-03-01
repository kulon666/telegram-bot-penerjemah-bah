const store = new Map();

export const DEFAULT_PREFS = Object.freeze({
  mode: "auto", // auto | manual
  formal: "neutral", // neutral | formal | casual
});

export function getPrefs(userId) {
  const id = String(userId || "");
  const v = store.get(id);
  if (v && typeof v === "object") return v;
  const fresh = { ...DEFAULT_PREFS };
  store.set(id, fresh);
  return fresh;
}

export function setMode(userId, mode) {
  const p = getPrefs(userId);
  p.mode = mode;
}

export function setFormal(userId, formal) {
  const p = getPrefs(userId);
  p.formal = formal;
}
