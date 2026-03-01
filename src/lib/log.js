export function safeErr(err) {
  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.message ||
    String(err)
  );
}

function toMeta(meta) {
  if (!meta || typeof meta !== "object") return {};
  try {
    return JSON.parse(JSON.stringify(meta));
  } catch {
    return { meta: "[unserializable]" };
  }
}

export const log = {
  info(msg, meta) {
    console.log(JSON.stringify({ level: "info", msg, ...toMeta(meta) }));
  },
  warn(msg, meta) {
    console.warn(JSON.stringify({ level: "warn", msg, ...toMeta(meta) }));
  },
  error(msg, meta) {
    console.error(JSON.stringify({ level: "error", msg, ...toMeta(meta) }));
  },
};
