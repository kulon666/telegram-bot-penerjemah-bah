import "dotenv/config";

import { run } from "@grammyjs/runner";
import { cfg } from "./lib/config.js";
import { log, safeErr } from "./lib/log.js";
import { createBot } from "./bot.js";

process.on("unhandledRejection", (r) => {
  console.error("UnhandledRejection:", r);
  process.exit(1);
});
process.on("uncaughtException", (e) => {
  console.error("UncaughtException:", e);
  process.exit(1);
});

let runner = null;
let restarting = false;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function startPollingWithRetry(bot) {
  if (restarting) return;
  restarting = true;

  let backoff = 2000;
  while (true) {
    try {
      log.info("polling start");

      try {
        await bot.api.deleteWebhook({ drop_pending_updates: true });
      } catch (e) {
        log.warn("deleteWebhook failed", { err: safeErr(e) });
      }

      runner = run(bot, { concurrency: 1 });
      log.info("polling running", { concurrency: 1 });
      restarting = false;
      return;
    } catch (e) {
      const msg = safeErr(e);

      // 409 happens on deploy overlap. Backoff and retry.
      log.warn("polling failed", { err: msg, backoffMs: backoff });
      await sleep(backoff);
      backoff = Math.min(20000, Math.round(backoff * 1.7));

      try {
        if (runner) {
          runner.abort();
          runner = null;
        }
      } catch {}
    }
  }
}

async function boot() {
  log.info("boot", {
    TELEGRAM_BOT_TOKEN_set: !!cfg.TELEGRAM_BOT_TOKEN,
    COOKMYBOTS_AI_ENDPOINT_set: !!cfg.COOKMYBOTS_AI_ENDPOINT,
    COOKMYBOTS_AI_KEY_set: !!cfg.COOKMYBOTS_AI_KEY,
  });

  if (!cfg.TELEGRAM_BOT_TOKEN) {
    console.error(
      "TELEGRAM_BOT_TOKEN is required. Set it in your environment and redeploy."
    );
    process.exit(1);
  }

  if (!cfg.COOKMYBOTS_AI_ENDPOINT || !cfg.COOKMYBOTS_AI_KEY) {
    log.warn("AI gateway not fully configured; translation will fail until set", {
      COOKMYBOTS_AI_ENDPOINT_set: !!cfg.COOKMYBOTS_AI_ENDPOINT,
      COOKMYBOTS_AI_KEY_set: !!cfg.COOKMYBOTS_AI_KEY,
    });
  }

  const bot = createBot(cfg.TELEGRAM_BOT_TOKEN);

  try {
    await bot.init();
  } catch (e) {
    log.warn("bot.init failed", { err: safeErr(e) });
  }

  try {
    await bot.api.setMyCommands([
      { command: "start", description: "Mulai dan lihat status" },
      { command: "help", description: "Panduan pemakaian" },
      { command: "translate", description: "Terjemahkan teks / reply" },
      { command: "mode", description: "Ubah mode auto/manual" },
      { command: "formal", description: "Ubah gaya: neutral/formal/casual" },
      { command: "detect", description: "Deteksi kemungkinan Bahasa Jawa" },
    ]);
  } catch (e) {
    log.warn("setMyCommands failed", { err: safeErr(e) });
  }

  // Memory log (lightweight)
  setInterval(() => {
    const m = process.memoryUsage();
    console.log(
      "[mem]",
      JSON.stringify({
        rssMB: Math.round(m.rss / 1e6),
        heapUsedMB: Math.round(m.heapUsed / 1e6),
      })
    );
  }, 60000).unref();

  await startPollingWithRetry(bot);
}

boot();
