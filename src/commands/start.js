import { getPrefs } from "../lib/userPrefs.js";

export default function register(bot) {
  bot.command("start", async (ctx) => {
    const userId = ctx.from?.id;
    const p = getPrefs(userId);

    const lines = [
      "Halo. Aku bot penerjemah Bahasa Jawa ke Bahasa Inggris.",
      "", 
      "Cara pakai: kirim teks Bahasa Jawa, nanti aku balas terjemahan Inggrisnya.",
      "Contoh:",
      "User: Aku arep lunga saiki",
      "Bot: I want to leave now.",
      "", 
      `Status kamu sekarang: mode=${p.mode}, formalitas=${p.formal}.`,
      "", 
      "Ketik /help untuk panduan lengkap.",
    ];

    await ctx.reply(lines.join("\n"));
  });
}
