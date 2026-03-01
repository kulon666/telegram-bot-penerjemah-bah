import { isLikelyJavanese } from "../lib/jawaDetect.js";

function getArgText(ctx) {
  const t = String(ctx.message?.text || "");
  const parts = t.split(" ");
  parts.shift();
  return parts.join(" ").trim();
}

export default function register(bot) {
  bot.command("detect", async (ctx) => {
    const replyText = ctx.message?.reply_to_message?.text;
    const argText = getArgText(ctx);

    const text = (replyText && String(replyText).trim()) || argText;
    if (!text) {
      return ctx.reply("Pakai: /detect <teks> atau reply sebuah pesan lalu kirim /detect.");
    }

    const ok = isLikelyJavanese(text);
    if (ok) {
      return ctx.reply("Kemungkinan Jawa: ya. Kalau mau diterjemahkan, pakai /translate atau kirim teks biasa (mode auto)." );
    }

    return ctx.reply("Kemungkinan Jawa: tidak. Kalau kamu tetap mau coba, pakai /translate." );
  });
}
