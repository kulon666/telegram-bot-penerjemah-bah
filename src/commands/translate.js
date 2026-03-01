import { cfg } from "../lib/config.js";
import { getPrefs } from "../lib/userPrefs.js";
import { translateJvToEn } from "../services/translator.js";

function getArgText(ctx) {
  const t = String(ctx.message?.text || "");
  const parts = t.split(" ");
  parts.shift();
  return parts.join(" ").trim();
}

export default function register(bot) {
  bot.command("translate", async (ctx) => {
    const replyText = ctx.message?.reply_to_message?.text;
    const argText = getArgText(ctx);

    const text = (replyText && String(replyText).trim()) || argText;

    if (!text) {
      return ctx.reply(
        "Pakai: /translate <teks> atau reply sebuah pesan lalu kirim /translate."
      );
    }

    const p = getPrefs(ctx.from?.id);

    const res = await translateJvToEn(cfg, { text, formal: p.formal });
    if (!res.ok) return ctx.reply(res.error);

    return ctx.reply(res.translation);
  });
}
