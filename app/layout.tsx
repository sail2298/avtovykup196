import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AvtoVykup196.ru - выкуп авто в Свердловской области",
  description:
    "Быстрый и честный выкуп автомобилей в Свердловской области. Деньги сразу, любая комплектация и состояние.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* ✅ Для адаптивности на телефонах */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* ✅ Подтверждение сайта в Яндекс Вебмастере */}
        <meta name="yandex-verification" content="2ea3a99d83033e35" />

        {/* ✅ Yandex.Metrika — подключается только на клиенте */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for (var j = 0; j < document.scripts.length; j++) {
                      if (document.scripts[j].src === r) { return; }
                  }
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0];
                  k.async=1;k.src=r;a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=104859381", "ym");

              ym(104859381, "init", {
                  ssr:true,
                  webvisor:true,
                  clickmap:true,
                  ecommerce:"dataLayer",
                  accurateTrackBounce:true,
                  trackLinks:true
              });
            `,
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* ✅ Поддержка noscript (если JS выключен) */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/104859381"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
