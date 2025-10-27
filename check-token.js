// check-token.js
import fetch from "node-fetch";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatIds = process.env.TELEGRAM_CHAT_ID;

console.log("🧩 Проверяем переменные окружения:");
console.log("TELEGRAM_BOT_TOKEN =", token || "(не найден)");
console.log("TELEGRAM_CHAT_ID =", chatIds || "(не найден)");

if (!token) {
  console.error("❌ Токен не найден. Проверь export или переменные в PM2.");
  process.exit(1);
}

(async () => {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    console.log("\n📡 Ответ Telegram API:");
    console.log(data);
  } catch (err) {
    console.error("⚠️ Ошибка запроса:", err.message);
  }
})();
