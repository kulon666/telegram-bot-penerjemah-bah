Bot ini menerjemahkan Bahasa Jawa ke Bahasa Inggris di Telegram.

Setup
1) Install dependencies: npm run install:root
2) Copy .env.sample menjadi .env lalu isi variabelnya
3) Jalankan: npm run dev

Environment variables
1) TELEGRAM_BOT_TOKEN (wajib)
Token bot Telegram dari BotFather.
2) COOKMYBOTS_AI_ENDPOINT (wajib untuk terjemahan)
Base URL CookMyBots AI Gateway. Contoh: https://api.cookmybots.com/api/ai
3) COOKMYBOTS_AI_KEY (wajib untuk terjemahan)
API key untuk CookMyBots AI Gateway.
4) AI_TIMEOUT_MS (opsional)
Default 600000.
5) AI_MODEL (opsional)
Jika ingin memilih model tertentu lewat gateway.

Perintah
1) /start
Menampilkan sambutan singkat dan status setting kamu (mode dan formalitas).
Contoh:
/start

2) /help
Panduan lengkap cara pakai dan contoh.

3) /translate
Terjemahkan teks.
Cara:
/translate Aku arep lunga saiki
Atau reply sebuah pesan lalu kirim:
/translate

4) /mode auto|manual
Mengatur apakah pesan teks biasa diterjemahkan otomatis.
Contoh:
/mode manual

5) /formal neutral|formal|casual
Mengatur gaya Bahasa Inggris.
Contoh:
/formal casual

6) /detect
Deteksi heuristik apakah teks kemungkinan Bahasa Jawa.
Cara:
/detect Aku ora ngerti
Atau reply pesan lalu:
/detect

Catatan
1) Preferensi user disimpan di memori runtime (in-memory). Kalau bot restart, kembali ke default.
2) Bot hanya memproses pesan teks. Media seperti foto atau voice akan diminta dikirim sebagai teks.
