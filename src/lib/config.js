export const cfg = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,

  // CookMyBots AI Gateway (required for translation features)
  // Base URL only, example: https://api.cookmybots.com/api/ai
  COOKMYBOTS_AI_ENDPOINT: process.env.COOKMYBOTS_AI_ENDPOINT || "",
  COOKMYBOTS_AI_KEY: process.env.COOKMYBOTS_AI_KEY || "",

  AI_MODEL: process.env.AI_MODEL || "",
  AI_DEBUG: String(process.env.AI_DEBUG || "0") === "1",

  // 10 minutes default (media/slow calls). Can be overridden.
  AI_TIMEOUT_MS: Number(process.env.AI_TIMEOUT_MS || 600000),
};
