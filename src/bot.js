import { Bot } from "grammy";
import { registerCommands } from "./commands/loader.js";
import { registerAgent } from "./features/agent.js";

export function createBot(token) {
  const bot = new Bot(token);

  // Commands first (middleware order matters)
  registerCommands(bot);

  // AI/auto-translate catch-all after commands
  registerAgent(bot);

  // Friendly handler for non-text messages
  bot.on("message", async (ctx, next) => {
    const hasText = typeof ctx.message?.text === "string";
    if (hasText) return next();

    // Ignore service messages etc. but be friendly for common media
    const m = ctx.message || {};
    const looksLikeUserMedia =
      !!m.sticker || !!m.photo || !!m.voice || !!m.video || !!m.document || !!m.audio;

    if (looksLikeUserMedia) {
      try {
        await ctx.reply("Aku belum bisa memproses media. Tolong kirim teks Bahasa Jawa ya.");
      } catch {
        // ignore
      }
    }

    return next();
  });

  bot.catch((err) => {
    const e = err?.error || err;
    console.error(
      JSON.stringify({
        level: "error",
        msg: "bot.catch",
        updateId: err?.ctx?.update?.update_id,
        err:
          e?.response?.data?.error?.message ||
          e?.response?.data?.message ||
          e?.message ||
          String(e),
      })
    );
  });

  return bot;
}
