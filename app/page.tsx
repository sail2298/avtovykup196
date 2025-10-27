"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const citiesRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setOk(res.ok);
      if (res.ok) form.reset();
    } catch {
      setOk(false);
    } finally {
      setLoading(false);
    }
  }

    // 👇 Анимация появления и исчезновения блока городов при скролле
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible(true);
            } else {
              setVisible(false);
            }
          });
        },
        {
          threshold: 0.2,
        }
      );

      if (citiesRef.current) observer.observe(citiesRef.current);

      return () => {
        if (citiesRef.current) observer.unobserve(citiesRef.current);
        observer.disconnect();
      };
    }, []);



  return (
    <main
      className="relative min-h-screen bg-cover bg-center text-white font-[Inter]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url('/bg.png')",
      }}
    >
      {/* Тёмный оверлей */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

        {/* HEADER */}
        <header className="fixed top-0 left-0 z-50 w-full bg-black/40 backdrop-blur-md border-b border-white/10 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-10 py-3">
            {/* Логотип */}
            <div className="text-center sm:text-left mb-2 sm:mb-0">
              <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-extrabold text-white leading-tight">
                <span className="text-[#C70000]">Avto</span>Vykup196.ru
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-300 leading-snug mt-1">
                Работаем по всей{" "}
                <span className="text-[#C70000]">Свердловской области</span>.{" "}
                Гарантия честной оценки и моментальной выплаты{" "}
                <span className="text-[#C70000]">наличными</span>.
              </p>
            </div>

            {/* Телефон */}
            <div className="text-center sm:text-right">
              <a
                href="tel:+79995661267"
                className="block text-[20px] sm:text-[24px] md:text-[28px] font-semibold text-white hover:text-[#C70000] transition-colors"
              >
                +7 <span className="text-[#C70000] font-bold">999</span> 566 1267
              </a>
              <p className="text-[11px] sm:text-[13px] font-light text-[#bfbfbf] mt-[-2px] tracking-wide">
                Выкуп авто в <span className="text-[#ffffff]">Свердловской области</span> - быстро
              </p>
            </div>
          </div>
        </header>



      {/* HERO + ФОРМА */}
      <section className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-16 pt-36 sm:pt-40 pb-16 gap-10 md:gap-14">
        {/* Текст */}
        <div className="max-w-lg text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            <span className="text-[#C70000]">Выкуп авто</span> <br />
            в Свердловской области -{" "}
            <span className="text-[#C70000]">быстро</span>
          </h1>
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
            Оценим ваш автомобиль за 5 минут и выкупим в день обращения. <br />
            Любое состояние - не на ходу, после ДТП, кредитные и без документов.
          </p>
        </div>

      {/* ФОРМА */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-[400px] bg-[#1a1a1a]/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-center mb-5 text-white">
          Оцените стоимость авто
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {["name", "phone", "brand", "model", "year"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={
                field === "name"
                  ? "ФИО"
                  : field === "phone"
                  ? "Номер телефона"
                  : field === "brand"
                  ? "Марка автомобиля"
                  : field === "model"
                  ? "Модель автомобиля"
                  : "Год выпуска автомобиля"
              }
              className="bg-[#2a2a2a]/80 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 transition-all duration-200"
              required={field === "phone"}
            />
          ))}

          <select
            name="type"
            className="bg-[#2a2a2a]/80 border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-700 transition-all duration-200 w-full"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Состояние авто
            </option>
            {[
              "Идеальное",
              "С пробегом",
              "Битое",
              "Кредитное",
              "После ДТП",
              "Не на ходу",
              "Другое",
            ].map((v) => (
              <option key={v} value={v.toLowerCase()} className="bg-[#111111] text-white">
                {v}
              </option>
            ))}
          </select>

          {/* Анимированная кнопка */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            animate={{
              opacity: loading ? 0.7 : 1,
              backgroundColor:
                status === "success"
                  ? "#16a34a" // зелёный
                  : status === "error"
                  ? "#dc2626" // красный
                  : "#ffffff", // белый по умолчанию
              color: status === "success" || status === "error" ? "#ffffff" : "#000000",
            }}
            transition={{ duration: 0.3 }}
            className="font-semibold py-3 rounded-lg shadow-md transition-all duration-300 hover:bg-red-700 hover:text-white disabled:opacity-60"
          >
            {loading
              ? "⏳ Отправка..."
              : status === "success"
              ? "✅ Отправлено!"
              : status === "error"
              ? "❌ Ошибка"
              : "Отправить заявку"}
          </motion.button>
        </form>

        {/* Анимированные сообщения */}
        <AnimatePresence>
          {status === "success" && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-green-500 text-center mt-3"
            >
              ✅ Заявка успешно отправлена
            </motion.p>
          )}
          {status === "tooFast" && (
            <motion.p
              key="tooFast"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-yellow-500 text-center mt-3"
            >
              ⚠️ Подождите 10 секунд перед повторной отправкой.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-center mt-3"
            >
              ❌ Ошибка при отправке. Попробуйте позже.
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-center text-sm mt-4 text-gray-300 leading-snug">
          Просто <span className="text-red-600">оставьте заявку</span> - мы свяжемся с
          вами в течение <span className="text-red-600">2 минут</span>.
        </p>
      </motion.div>

      </section>

      {/* Блок городов */}
      <section
        ref={citiesRef}
        className={`relative z-10 bg-black/80 text-white py-16 px-6 sm:px-10 md:px-20 transform transition-all duration-700 ease-in-out ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-95"
        }`}
      >
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 text-[#C70000]">
          Работаем по всей Свердловской области
        </h2>
        <p className="text-center max-w-3xl mx-auto text-gray-300 mb-10">
          Мы приедем в любой город региона - оценим, оформим и выкупим ваш автомобиль в день обращения.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-gray-200 text-sm">
          {[
            "Екатеринбург",
            "Нижний Тагил",
            "Каменск-Уральский",
            "Первоуральск",
            "Серов",
            "Новоуральск",
            "Асбест",
            "Берёзовский",
            "Ревда",
            "Полевской",
            "Алапаевск",
            "Ирбит",
            "Качканар",
            "Красноуральск",
            "Невьянск",
            "Арамиль",
            "Сухой Лог",
            "Туринск",
            "Камышлов",
            "Богданович",
            "Верхняя Пышма",
            "Среднеуральск",
            "Верхотурье",
            "Артёмовский",
            "Пышма",
          ].map((city) => (
            <span
              key={city}
              className="border border-gray-700/50 rounded-lg py-2 text-center bg-[#1a1a1a]/60 hover:bg-[#C70000]/80 hover:text-white transition-all duration-200"
            >
              {city}
            </span>
          ))}
        </div>
      </section>



      {/* FOOTER */}
      <footer className="bg-black/80 py-10 px-6 text-center sm:text-left border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
        {/* Левая часть */}
        <div className="flex flex-col items-center sm:items-start">
          <a
            href="tel:+79995661267"
            className="text-[22px] sm:text-[24px] font-semibold text-white hover:text-[#C70000] transition-colors mb-2"
          >
            +7 <span className="text-[#C70000] font-bold">999</span> 566 1267
          </a>

          <p className="text-gray-400 text-sm mb-3 sm:mb-4">
            © 2025 AvtoVykup196.ru - Все права защищены
          </p>

          <a
            href="/files/Политика_конфиденциальности_AvtoVykup196.docx"
            download
            className="text-gray-400 hover:text-[#C70000] text-sm underline transition-colors"
          >
            Политика конфиденциальности
          </a>
        </div>

        {/* Правая часть - кнопки */}
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
          {/* WhatsApp */}
          <a
            href="https://wa.me/79995661267"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA955] text-black font-semibold px-5 py-2 rounded-full shadow-md transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="black"
              className="w-5 h-5"
            >
              <path d="M16 2.9C8.5 2.9 2.4 9 2.4 16.4c0 2.5.6 5 1.8 7.2L2 30l6.7-2.1c2 1.1 4.3 1.7 6.6 1.7 7.5 0 13.6-6.1 13.6-13.5C28.9 9 23.5 2.9 16 2.9zm0 24.3c-1.9 0-3.8-.5-5.4-1.4l-.4-.2-3.9 1.2 1.3-3.8-.3-.4a10.8 10.8 0 1119.8-5.4c0 6-4.9 10.8-11 10.8zm6-7c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.2-.7.2s-.8 1-1 1.1-.3.2-.6.1a9.2 9.2 0 01-4.3-2.6c-.8-.8-1.3-1.8-1.5-2.1s0-.4.1-.5l.6-.6c.1-.2.2-.3.3-.4.1-.1.1-.2 0-.4-.1-.2-.5-1.4-.7-2-.2-.6-.4-.5-.6-.5H10c-.2 0-.5.1-.7.3-.8.8-1.2 1.9-1.2 3 0 1 .3 1.9.6 2.6.8 1.8 2.3 3.3 4.2 4.4.6.3 1.3.6 1.9.8.8.2 1.5.2 2.1.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.2.1-1.3 0-.2-.2-.3-.4-.4z" />
            </svg>
            Написать в WhatsApp
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/Yan_Yanovich3"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#007ab8] text-white font-semibold px-5 py-2 rounded-full shadow-md transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="white"
              className="w-5 h-5"
            >
              <path d="M30.6 4.2a2 2 0 00-2.1-.3L3.7 13.4a1.6 1.6 0 00.2 3l6.3 1.9 2.4 7.4a1.6 1.6 0 002.7.7l3.7-3.4 6.3 4.6a1.6 1.6 0 002.6-.9l3.9-19a1.7 1.7 0 00-.2-1.5zM24.6 8.6l-9.5 9-.4 4.4-1.6-5.2 10.6-8.2z" />
            </svg>
            Написать в Telegram
          </a>
        </div>
      </footer>


    </main>
  );
}
