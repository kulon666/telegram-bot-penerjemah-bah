import { getPrefs, setFormal } from "../lib/userPrefs.js";

function getArg(ctx) {
  const t = String(ctx.message?.text || "").trim();
  const parts = t.split(/\s+/);
  parts.shift();
  return String(parts[0] || "").toLowerCase();
}

export default function register(bot) {
  bot.command("formal", async (ctx) => {
    const arg = getArg(ctx);
    const userId = ctx.from?.id;

    if (arg !== "neutral" && arg !== "formal" && arg !== "casual") {
      const p = getPrefs(userId);
      return ctx.reply(
        `Pakai: /formal neutral|formal|casual. Status kamu sekarang: formalitas=${p.formal}.`
      );
    }

    setFormal(userId, arg);
    return ctx.reply(`Oke, formalitas diset ke ${arg}.`);
  });
}
