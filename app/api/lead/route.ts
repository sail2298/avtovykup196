export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

// 🧠 Память для антиспама (IP → время последней отправки)
const lastRequestMap = new Map<string, number>();

// 🕒 Универсальный fetch с таймаутом
async function fetchWithTimeout(
  resource: string,
  options: RequestInit = {},
  timeout = 20000
): Promise<Response> {
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

    // 🔍 Антиспам
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const lastRequest = lastRequestMap.get(ip) || 0;
    const diff = now - lastRequest;

    if (diff < 10_000) {
      console.warn(`⏳ Частые запросы с IP ${ip}`);
      return new NextResponse(
        JSON.stringify({
          ok: false,
          error: "Слишком частые запросы. Повторите через 10 секунд.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    lastRequestMap.set(ip, now);

    const body = await req.json();
    console.log("📦 Получены данные формы:", body);

    const { name, phone, brand, model, year, type } = body;

    // Проверка телефона
    if (!phone) {
      return new NextResponse(
        JSON.stringify({ ok: false, error: "Phone is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const isValid = /^(\+7|7|8)\d{10}$/.test(cleanPhone);
    if (!isValid) {
      console.warn("⚠️ Некорректный номер телефона:", phone);
      return new NextResponse(
        JSON.stringify({ ok: false, error: "Invalid phone number" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ⚙️ Читаем переменные из .env.local
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatIdsRaw = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatIdsRaw) {
      console.error("❌ TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы");
      return new NextResponse(
        JSON.stringify({ ok: false, error: "Missing Telegram config" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Проверка токена
    const test = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const check = await test.json();
    if (!check.ok) {
      console.error("❌ Токен Telegram недействителен:", check);
      return new NextResponse(
        JSON.stringify({ ok: false, error: "Invalid Telegram token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const chatIds = chatIdsRaw.split(",").map((id) => id.trim());
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // 📨 Сообщение
    const message =
      `🆕 Новая заявка на выкуп авто\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Имя: ${name || "-"}\n` +
      `📞 Телефон: ${cleanPhone}\n` +
      `🚗 Марка: ${brand || "-"}\n` +
      `🔧 Модель: ${model || "-"}\n` +
      `📅 Год: ${year || "-"}\n` +
      `⚙️ Состояние: ${type || "-"}\n` +
      `🕒 Время: ${new Date().toLocaleString("ru-RU")}\n` +
      `━━━━━━━━━━━━━━━━━━━`;

    const waNumber = cleanPhone.replace(/^\+?8/, "7").replace(/^\+/, "");
    const keyboard = {
      inline_keyboard: [[{ text: "💬 Написать в WhatsApp", url: `https://wa.me/${waNumber}` }]],
    };

    // 🚀 Отправка сообщений
    for (const chatId of chatIds) {
      try {
        const response = await fetchWithTimeout(
          url,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: message, reply_markup: keyboard }),
          },
          20000
        );

        const data = await response.json().catch(() => null);
        if (!data?.ok) {
          console.error(`❌ Ошибка Telegram (${chatId}):`, data?.description || "Unknown error");
        } else {
          console.log(`✅ Сообщение отправлено в чат ${chatId}`);
        }
      } catch (err: any) {
        console.error(`❌ Telegram fetch error (${chatId}):`, err.message);
      }
    }

    return new NextResponse(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("❌ API error:", err);
    return new NextResponse(
      JSON.stringify({ ok: false, error: err.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
