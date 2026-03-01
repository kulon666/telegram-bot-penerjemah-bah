import { aiChat } from "../lib/ai.js";
import { buildBotProfile } from "../lib/botProfile.js";

function clampText(text, maxChars) {
  const t = String(text || "");
  if (t.length <= maxChars) return { ok: true, text: t };
  return { ok: false, text: t.slice(0, maxChars) };
}

export async function translateJvToEn(cfg, { text, formal = "neutral" } = {}) {
  const MAX_CHARS = 2500;
  const clamped = clampText(text, MAX_CHARS);
  if (!clamped.ok) {
    return {
      ok: false,
      error: `Teksnya kepanjangan (maks ${MAX_CHARS} karakter). Tolong pecah jadi beberapa pesan.`,
      translation: "",
    };
  }

  const styleLine =
    formal === "formal"
      ? "Use a more formal, polite, professional English style."
      : formal === "casual"
        ? "Use a casual, relaxed English style."
        : "Use a neutral standard English style.";

  const system = [
    buildBotProfile(),
    "", 
    "You are a translation engine.",
    "Task: Translate from Javanese (can be ngoko/krama mix) to English.",
    "Preserve meaning, context, and tone.",
    styleLine,
    "Output rules:",
    "- Output ONLY the English translation.",
    "- Keep line breaks if the input has multiple lines.",
    "- Do not add explanations unless the user explicitly asks for an explanation.",
  ].join("\n");

  const res = await aiChat(cfg, {
    messages: [
      { role: "system", content: system },
      { role: "user", content: String(clamped.text || "") },
    ],
    meta: { platform: "telegram", feature: "jv_to_en" },
  });

  const content = res?.output?.type === "chat" ? String(res.output.content || "") : "";

  if (!res?.ok || !content.trim()) {
    return {
      ok: false,
      error:
        res?.status === 412
          ? "Fitur AI belum dikonfigurasi. Minta admin set COOKMYBOTS_AI_ENDPOINT dan COOKMYBOTS_AI_KEY."
          : "Maaf, lagi ada masalah saat menerjemahkan. Coba lagi sebentar ya.",
      translation: "",
    };
  }

  return { ok: true, translation: content, error: null };
}
