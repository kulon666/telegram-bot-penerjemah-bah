import { log, safeErr } from "./log.js";

function trimSlash(u) {
  u = String(u || "");
  while (u.endsWith("/")) u = u.slice(0, -1);
  return u;
}

function withTimeout(ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return { ctrl, clear: () => clearTimeout(t) };
}

function pickTimeout(cfg) {
  const v = Number(cfg?.AI_TIMEOUT_MS || 600000);
  return Number.isFinite(v) && v > 0 ? v : 600000;
}

function pickModel(cfg, override) {
  const m = String(override || cfg?.AI_MODEL || "").trim();
  return m || undefined;
}

async function safeReadJson(res) {
  const text = await res.text();
  try {
    return { text, json: JSON.parse(text) };
  } catch {
    return { text, json: null };
  }
}

export async function aiChat(cfg, { messages, model, meta } = {}) {
  const base = trimSlash(cfg?.COOKMYBOTS_AI_ENDPOINT || "");
  const key = String(cfg?.COOKMYBOTS_AI_KEY || "");

  if (!base || !key) {
    return {
      ok: false,
      status: 412,
      output: null,
      error: "AI_NOT_CONFIGURED (missing COOKMYBOTS_AI_ENDPOINT/COOKMYBOTS_AI_KEY)",
    };
  }

  const timeoutMs = pickTimeout(cfg);
  const url = base + "/chat";

  const started = Date.now();
  const charCount = Array.isArray(messages)
    ? messages.reduce((n, m) => n + String(m?.content || "").length, 0)
    : 0;

  log.info("ai.chat start", {
    feature: "translate",
    timeoutMs,
    modelSet: !!pickModel(cfg, model),
    messagesCount: Array.isArray(messages) ? messages.length : 0,
    charCount,
  });

  const { ctrl, clear } = withTimeout(timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: Array.isArray(messages) ? messages : [],
        model: pickModel(cfg, model),
        meta: meta || undefined,
      }),
      signal: ctrl.signal,
    });

    const { json } = await safeReadJson(res);

    if (!res.ok) {
      const msg =
        json?.error ||
        json?.message ||
        "AI_ERROR";

      log.warn("ai.chat fail", {
        feature: "translate",
        status: res.status,
        ms: Date.now() - started,
        err: String(msg).slice(0, 400),
      });

      return { ok: false, status: res.status, output: null, error: String(msg) };
    }

    const out = json?.output || null;
    const content = out?.type === "chat" ? String(out?.content || "") : "";

    log.info("ai.chat success", {
      feature: "translate",
      status: res.status,
      ms: Date.now() - started,
      outType: out?.type || "",
      outChars: content.length,
    });

    return { ok: true, status: res.status, output: out, error: null };
  } catch (e) {
    const msg = safeErr(e);
    log.warn("ai.chat exception", {
      feature: "translate",
      ms: Date.now() - started,
      err: String(msg).slice(0, 400),
    });
    return { ok: false, status: e?.name === "AbortError" ? 408 : 0, output: null, error: msg };
  } finally {
    clear();
  }
}
