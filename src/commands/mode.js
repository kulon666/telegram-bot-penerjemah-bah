import { getPrefs, setMode } from "../lib/userPrefs.js";

function getArg(ctx) {
  const t = String(ctx.message?.text || "").trim();
  const parts = t.split(/\s+/);
  parts.shift();
  return String(parts[0] || "").toLowerCase();
}

export default function register(bot) {
  bot.command("mode", async (ctx) => {
    const arg = getArg(ctx);
    const userId = ctx.from?.id;

    if (arg !== "auto" && arg !== "manual") {
      const p = getPrefs(userId);
      return ctx.reply(
        `Pakai: /mode auto atau /mode manual. Status kamu sekarang: mode=${p.mode}.`
      );
    }

    setMode(userId, arg);
    return ctx.reply(`Oke, mode diset ke ${arg}.`);
  });
}
