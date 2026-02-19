import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";
import { SITE } from "./lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const title =
  "ЛОК ВЕРА - апартаменты в Сочи | Инвестиции в курортную недвижимость";
const description =
  "Апартаменты в ЛОК VERA в Сочи, Уч-Дере. Инвестиционный формат, 214-ФЗ, эскроу. Получите презентацию.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090b10",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title,
  description,
  verification: {
    yandex: "2a838b9a9e2125dc",
    google: "vWl3DpyPY0OuPeUPlv0-SasxMQAnWQgJWZr0J6xCV2M",
  },
  referrer: "origin-when-cross-origin",
  creator: SITE.name,
  publisher: SITE.name,
  category: "real estate",
  formatDetection: {
    email: false,
    telephone: true,
    address: true,
  },
  keywords: [
    "апартаменты Сочи",
    "Уч-Дере недвижимость",
    "инвестиции в Сочи",
    "курортная недвижимость",
    "wellness-туризм",
    "медицинский туризм",
    "инвестиции в апартаменты",
  ],
  alternates: {
    canonical: SITE.url,
    languages: {
      "ru-RU": SITE.url,
      "x-default": SITE.url,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title,
    description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/images/facade-day.jpg",
        width: 1200,
        height: 630,
        alt: "ЛОК VERA в Сочи",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/facade-day.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <Script src="/runtime-config.js" strategy="beforeInteractive" />
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106874983', 'ym');
            ym(106874983, 'init', {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: "dataLayer",
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce: true,
              trackLinks: true
            });
          `}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/106874983"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
