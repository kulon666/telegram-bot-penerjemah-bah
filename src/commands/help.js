export default function register(bot) {
  bot.command("help", async (ctx) => {
    const text = [
      "Fitur bot ini: menerjemahkan Bahasa Jawa ke Bahasa Inggris.",
      "", 
      "Cara pakai:",
      "1) Mode auto (default): kirim teks biasa (bukan command), bot akan menerjemahkan.",
      "2) /translate <teks> untuk menerjemahkan teks tertentu.",
      "3) Reply sebuah pesan lalu kirim /translate untuk menerjemahkan pesan yang direply.",
      "4) /mode auto atau /mode manual untuk mengatur apakah pesan biasa diterjemahkan otomatis.",
      "5) /formal neutral|formal|casual untuk mengatur gaya Bahasa Inggris.",
      "6) /detect <teks> atau reply lalu /detect untuk cek kemungkinan teksnya Bahasa Jawa.",
      "", 
      "Contoh:",
      "User: /mode manual",
      "Bot: Oke, mode manual aktif.",
      "", 
      "User: /translate Kowe wis mangan durung?",
      "Bot: Have you eaten yet?",
      "", 
      "User: /formal formal",
      "Bot: Oke, formalitas diset ke formal.",
      "", 
      "User: /detect Aku ora ngerti",
      "Bot: Kemungkinan Jawa: ya. Coba pakai /translate.",
    ].join("\n");

    await ctx.reply(text);
  });
}
