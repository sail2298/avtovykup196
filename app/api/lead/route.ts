import { NextResponse } from "next/server";

// 🕒 Универсальная функция fetch с таймаутом
async function fetchWithTimeout(resource: string, options: any = {}, timeout = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    console.log("✅ API вызван — lead route запущен");

    const body = await req.json();
    console.log("📦 Получены данные формы:", body);

    const { name, phone, brand, model, year, type } = body;

    // 🧩 Проверка обязательных данных
    if (!phone) {
      return NextResponse.json({ ok: false, error: "Phone is required" }, { status: 400 });
    }

    // 📱 Очистка и валидация номера
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const isValid = /^(\+7|7|8)\d{10}$/.test(cleanPhone);
    if (!isValid) {
      console.warn("⚠️ Некорректный номер телефона:", phone);
      return NextResponse.json({ ok: false, error: "Invalid phone number" }, { status: 400 });
    }

    // ⚙️ Переменные окружения
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatIdsRaw = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatIdsRaw) {
      console.error("❌ Отсутствует TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
      return NextResponse.json({ ok: false, error: "Missing Telegram config" }, { status: 500 });
    }

    const chatIds = chatIdsRaw.split(",").map((id) => id.trim());
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // 🧩 Экранирование для MarkdownV2
    const escapeMd = (text: string) =>
      text ? text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1") : "-";

    // 💬 Текст сообщения
    const message =
      `🆕 *Новая заявка на выкуп авто*\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Имя:* ${escapeMd(name)}\n` +
      `📞 *Телефон:* ${escapeMd(cleanPhone)}\n` +
      `🚗 *Марка:* ${escapeMd(brand)}\n` +
      `🔧 *Модель:* ${escapeMd(model)}\n` +
      `📅 *Год:* ${escapeMd(year)}\n` +
      `⚙️ *Состояние:* ${escapeMd(type)}\n` +
      `🕒 *Время:* ${escapeMd(new Date().toLocaleString("ru-RU"))}\n` +
      `━━━━━━━━━━━━━━━━━━━`;

    // 💬 Кнопка WhatsApp
    const waNumber = cleanPhone.replace(/^\+?8/, "7").replace(/^\+/, "");
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "💬 Написать в WhatsApp",
            url: `https://wa.me/${waNumber}`,
          },
        ],
      ],
    };

    // 🚀 Отправка в каждый чат
    for (const chatId of chatIds) {
      const response = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "MarkdownV2",
            reply_markup: keyboard,
          }),
        },
        20000
      );

      const data = await response.json();

      if (!data.ok) {
        console.error(`❌ Ошибка Telegram (${chatId}):`, data.description);
      } else {
        console.log(`✅ Сообщение отправлено в чат ${chatId}`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("❌ API error:", err);
    return NextResponse.json({ ok: false, error: err.message || "Unknown error" }, { status: 500 });
  }
}
