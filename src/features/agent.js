import { cfg } from "../lib/config.js";
import { log, safeErr } from "../lib/log.js";
import { getPrefs } from "../lib/userPrefs.js";
import { translateJvToEn } from "../services/translator.js";

const perChat = new Map();
let globalInflight = 0;
const GLOBAL_CAP = 1;

function lockKey(ctx) {
  const chatId = ctx.chat?.id;
  return String(chatId || ctx.from?.id || "unknown");
}

export function registerAgent(bot) {
  bot.on("message:text", async (ctx, next) => {
    const raw = String(ctx.message?.text || "");
    if (raw.startsWith("/")) return next();

    const userId = ctx.from?.id;
    const p = getPrefs(userId);
    if (p.mode !== "auto") return next();

    const key = lockKey(ctx);
    if (perChat.get(key)) {
      return ctx.reply("Aku masih ngerjain permintaanmu yang sebelumnya. Tunggu sebentar ya.");
    }
    if (globalInflight >= GLOBAL_CAP) {
      return ctx.reply("Lagi ramai. Coba lagi sebentar ya.");
    }

    perChat.set(key, true);
    globalInflight += 1;

    const started = Date.now();
    try {
      const text = String(raw || "").trim();
      if (!text) return next();

      const res = await translateJvToEn(cfg, { text, formal: p.formal });
      if (!res.ok) return ctx.reply(res.error);

      try {
        await ctx.reply(res.translation);
      } catch (e) {
        log.warn("telegram send fail", { err: safeErr(e) });
        // Fallback: send plain text anyway (no markdown used, so should be safe)
        try {
          await ctx.reply(String(res.translation || ""));
        } catch (e2) {
          log.error("telegram send fail (fallback)", { err: safeErr(e2) });
        }
      }
    } catch (e) {
      log.error("agent translate error", { err: safeErr(e), ms: Date.now() - started });
      await ctx.reply("Maaf, ada error saat memproses pesan. Coba lagi ya.");
    } finally {
      perChat.delete(key);
      globalInflight = Math.max(0, globalInflight - 1);
      const ms = Date.now() - started;
      if (ms > 0) log.info("agent cycle", { ms });
    }
  });
}
