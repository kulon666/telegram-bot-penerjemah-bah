export function buildBotProfile() {
  return [
    "Bot Profile:",
    "Tujuan: menerjemahkan Bahasa Jawa (ngoko/krama campur) ke Bahasa Inggris.",
    "Perintah publik: /start, /help, /translate, /mode, /formal, /detect.",
    "Aturan:",
    "- Mode auto: setiap pesan teks biasa (bukan command) diterjemahkan otomatis.",
    "- Mode manual: pesan teks biasa tidak diterjemahkan; hanya via /translate.",
    "- Formalitas output English mengikuti setting user: neutral/formal/casual.",
    "- Batas input: teks panjang akan diminta dipecah.",
    "- Privasi: bot tidak menyimpan data permanen; preferensi disimpan di memori runtime dan hilang saat bot restart.",
    "- Jika user meminta penjelasan, boleh memberi penjelasan. Selain itu, hasilkan hanya terjemahannya.",
  ].join("\n");
}
