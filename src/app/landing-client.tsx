
"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { SITE } from "./lib/site";

const trustChips = [
  "ГК «Медскан»",
  "214-ФЗ / эскроу",
  "Курортная недвижимость Сочи",
  "Уч-Дере",
];

const navLinks = [
  { href: "#about", label: "О проекте" },
  { href: "#invest", label: "Инвестиции" },
  { href: "#medicine", label: "Медицина" },
  { href: "#location", label: "Локация" },
  { href: "#faq", label: "FAQ" },
];

const navSectionIds = navLinks.map((item) => item.href.replace("#", ""));

const keyFacts = [
  {
    value: "3",
    label: "сильных опоры",
    text: "Курорт, медицинский центр и wellness-инфраструктура в одном проекте.",
  },
  {
    value: "1",
    label: "единая экосистема",
    text: "Личное проживание, восстановление и инвестиционный сценарий без разрыва между сервисами.",
  },
  {
    value: "214-ФЗ",
    label: "прозрачный формат",
    text: "Продажи в правовом поле с использованием эскроу-механики.",
  },
];

const investmentScenarios = [
  {
    title: "Личная резиденция",
    text: "Апартаменты в Сочи для собственного отдыха и длительного проживания.",
    marker: "Lifestyle",
  },
  {
    title: "Инвестиционный сценарий",
    text: "Потенциальная аренда через управляющую модель в курортном сегменте.",
    marker: "Income",
  },
  {
    title: "Комбинированный формат",
    text: "Личное использование в нужные даты + аренда в пиковые периоды.",
    marker: "Hybrid",
  },
];

const investmentSignals = [
  { title: "Драйвер спроса", text: "wellness-туризм и внутренний туризм" },
  { title: "Юридическая модель", text: "214-ФЗ / эскроу" },
  { title: "Формат использования", text: "личная резиденция + аренда" },
];

const medicalDirections = [
  {
    title: "Longevity",
    text: "Фокус на активном долголетии и качестве жизни.",
  },
  {
    title: "Превентивная медицина",
    text: "Диагностические и профилактические сценарии для резидентов и гостей.",
  },
  {
    title: "Anti-age и восстановление",
    text: "Комплексные wellness- и восстановительные программы.",
  },
  {
    title: "Семейные и корпоративные форматы",
    text: "Персонализированные решения для разных профилей аудитории.",
  },
];

const faqItems = [
  {
    question: "Что означает 214-ФЗ для покупателя?",
    answer:
      "Это понятная правовая конструкция сделки и прозрачные условия покупки в рамках действующего законодательства.",
  },
  {
    question: "Как работает эскроу-счет?",
    answer:
      "Средства хранятся в банке на специальном счете и перечисляются застройщику после выполнения условий договора.",
  },
  {
    question: "Можно ли использовать апартамент для личного проживания?",
    answer:
      "Да. Формат проекта предполагает личное использование апартамента как курортной резиденции.",
  },
  {
    question: "Есть ли сценарий аренды?",
    answer:
      "Да, возможен инвестиционный сценарий с потенциальной сдачей в аренду. Условия уточняются.",
  },
  {
    question: "Когда старт продаж?",
    answer:
      "Актуальные даты старта продаж уточняются. Оставьте заявку, чтобы получить информацию первыми.",
  },
  {
    question: "Можно ли приобрести в рассрочку?",
    answer:
      "Возможные финансовые условия уточняются индивидуально после консультации.",
  },
  {
    question: "Какие форматы апартаментов будут доступны?",
    answer:
      "Проект предусматривает несколько форматов. Планировки и параметры предоставляются по запросу.",
  },
  {
    question: "Как получить презентацию и документы?",
    answer:
      "Заполните форму, и менеджер направит презентацию, условия и информационный пакет проекта.",
  },
];

type LeadPayload = {
  name: string;
  phone: string;
  contact_method: string;
  page_url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: {
      leadWebhookUrl?: string;
      telegramBotToken?: string;
      telegramChatId?: string;
    };
  }
}

function getLeadEndpoint() {
  const runtimeEndpoint =
    typeof window !== "undefined"
      ? window.__APP_CONFIG__?.leadWebhookUrl?.trim() ?? ""
      : "";

  return runtimeEndpoint || process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL?.trim() || "/api/lead";
}

function getTelegramConfig() {
  const runtimeConfig = typeof window !== "undefined" ? window.__APP_CONFIG__ : undefined;

  const botToken =
    runtimeConfig?.telegramBotToken?.trim() ??
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN?.trim() ??
    "";
  const chatId =
    runtimeConfig?.telegramChatId?.trim() ??
    process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID?.trim() ??
    "";

  return { botToken, chatId };
}

async function postLead(endpoint: string, payload: LeadPayload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send lead to endpoint: ${endpoint}`);
  }

  return response.json().catch(() => ({ ok: true }));
}

function formatLeadText(payload: LeadPayload) {
  const submittedAt = new Date().toISOString();
  const optionalRows = [
    payload.utm_source ? `utm_source: ${payload.utm_source}` : "",
    payload.utm_medium ? `utm_medium: ${payload.utm_medium}` : "",
    payload.utm_campaign ? `utm_campaign: ${payload.utm_campaign}` : "",
    payload.utm_term ? `utm_term: ${payload.utm_term}` : "",
    payload.utm_content ? `utm_content: ${payload.utm_content}` : "",
  ].filter(Boolean);

  return [
    "Новая заявка с сайта вера-лок.рф",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Способ связи: ${payload.contact_method}`,
    `Страница: ${payload.page_url || "unknown"}`,
    `Время (UTC): ${submittedAt}`,
    ...optionalRows,
  ].join("\n");
}

async function sendLeadToTelegram(payload: LeadPayload, botToken: string, chatId: string) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLeadText(payload),
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send lead to Telegram");
  }

  const result = await response.json().catch(() => null);
  if (!result?.ok) {
    throw new Error("Failed to send lead to Telegram");
  }

  return result;
}

async function sendLead(payload: LeadPayload) {
  const endpoint = getLeadEndpoint();

  try {
    return await postLead(endpoint, payload);
  } catch {
    const { botToken, chatId } = getTelegramConfig();

    if (botToken && chatId) {
      return sendLeadToTelegram(payload, botToken, chatId);
    }

    throw new Error("Failed to send lead");
  }
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.72, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-90px" }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <p className="kicker">{eyebrow}</p>
      <h2 className="title-lg mt-4 text-white">{title}</h2>
      {subtitle ? <p className="mt-5 max-w-3xl text-lg text-white/70">{subtitle}</p> : null}
    </div>
  );
}

function LeadForm({
  utm,
  id,
  title,
  subtitle,
  buttonLabel,
}: {
  utm: Record<string, string>;
  id: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("Телефон");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (website.trim().length > 0) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const pageUrl =
        typeof window !== "undefined" ? window.location.href : SITE.url;

      const payload: LeadPayload = {
        name,
        phone,
        contact_method: contactMethod,
        page_url: pageUrl,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_term: utm.utm_term,
        utm_content: utm.utm_content,
      };

      await sendLead(payload);
      setSuccess(true);
      setName("");
      setPhone("");
    } catch {
      setError("Не удалось отправить заявку. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" id={id}>
      <h3 className="text-2xl text-white md:text-3xl">{title}</h3>
      <p className="mt-3 text-sm text-white/65">{subtitle}</p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label htmlFor={`${id}-name`} className="sr-only">
          Имя
        </label>
        <input
          id={`${id}-name`}
          name="name"
          className="field"
          placeholder="Ваше имя"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
        />
        <label htmlFor={`${id}-phone`} className="sr-only">
          Телефон
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          className="field"
          placeholder="Телефон"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
          required
        />
        <label htmlFor={`${id}-contact`} className="sr-only">
          Способ связи
        </label>
        <select
          id={`${id}-contact`}
          name="contact_method"
          className="field"
          value={contactMethod}
          onChange={(event) => setContactMethod(event.target.value)}
        >
          <option className="text-black">Телефон</option>
          <option className="text-black">WhatsApp</option>
          <option className="text-black">Telegram</option>
        </select>
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
        <button className="btn-primary" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Отправка..." : buttonLabel}
        </button>
        <p className="sr-only" aria-live="polite">
          {loading ? "Заявка отправляется" : "Форма готова к отправке"}
        </p>
      </form>
      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      <p className="mt-3 text-xs text-white/50">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
      </p>

      {success ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Заявка отправлена"
        >
          <div className="glass-panel max-w-md">
            <h4 className="text-xl text-white">Спасибо, заявка получена.</h4>
            <p className="mt-2 text-sm text-white/70">
              Менеджер свяжется с вами и отправит презентацию проекта.
            </p>
            <button
              className="btn-primary mt-6 w-full"
              type="button"
              onClick={() => setSuccess(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function LandingClient() {
  const searchParams = useSearchParams();
  const { scrollY } = useScroll();
  const heroShift = useTransform(scrollY, [0, 800], [0, -50]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const targets = navSectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (!targets.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target instanceof HTMLElement) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const utm = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      utm_term: params.get("utm_term") ?? "",
      utm_content: params.get("utm_content") ?? "",
    };
  }, [searchParams]);

  const faqJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }),
    []
  );

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phoneTel,
    areaServed: "RU",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phoneTel,
        contactType: "sales",
        areaServed: "RU",
        availableLanguage: ["ru"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Сочи",
      addressRegion: "Краснодарский край",
      addressCountry: "RU",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "ru-RU",
    potentialAction: {
      "@type": "CommunicateAction",
      target: `tel:${SITE.phoneTel}`,
    },
  };

  const apartmentComplexJsonLd = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phoneTel,
    description:
      "Апартаменты в курортном комплексе ЛОК VERA в Сочи, Уч-Дере. Инвестиционный формат с медицинской и wellness-инфраструктурой.",
    image: [
      `${SITE.url}/images/facade-day.jpg`,
      `${SITE.url}/images/night-facade.jpg`,
      `${SITE.url}/images/resort-pool.jpg`,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Сочи",
      addressRegion: "Краснодарский край",
      addressCountry: "RU",
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Wellness-инфраструктура",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Медицинская составляющая",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Курортный формат проживания",
        value: true,
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "ЛОК VERA",
    url: SITE.url,
    inLanguage: "ru-RU",
    about: ["апартаменты Сочи", "инвестиции в апартаменты", "курортная недвижимость"],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: SITE.url,
      },
    ],
  };

  return (
    <div className="relative overflow-hidden bg-[color:var(--bg-0)] text-white">
      <a href="#main-content" className="skip-link">
        Перейти к контенту
      </a>
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="ld-site"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="ld-apartment-complex"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(apartmentComplexJsonLd) }}
      />
      <Script
        id="ld-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-grid absolute inset-0 opacity-25" />
        <div className="absolute -left-48 top-20 h-[560px] w-[560px] rounded-full bg-[color:var(--gold)]/20 blur-[160px]" />
        <div className="absolute right-[-240px] top-72 h-[660px] w-[660px] rounded-full bg-[color:var(--sage)]/20 blur-[190px]" />
      </div>

      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="lux-container top-shell flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-dot" />
            <div>
              <p className="kicker">ЛОК VERA</p>
              <p className="text-sm text-white/85">Курортный комплекс нового поколения</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Главное меню">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${
                  activeSection === item.href.replace("#", "") ? "text-white" : ""
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <a href={`tel:${SITE.phoneTel}`} className="text-sm text-white/90">
              {SITE.phoneDisplay}
            </a>
            <a href="#lead-final" className="btn-primary">
              Получить презентацию
            </a>
          </div>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
          >
            <span className="flex flex-col gap-[5px]">
              <span className="menu-line" />
              <span className="menu-line" />
              <span className="menu-line" />
            </span>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Закрыть меню"
                className="fixed inset-0 z-40 bg-black/50 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Мобильное меню"
              >
                <div className="flex flex-col gap-4">
                  {navLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-sm uppercase tracking-[0.2em] text-white/75"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="soft-separator mt-2" />
                  <a
                    href={`tel:${SITE.phoneTel}`}
                    className="text-base font-medium text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    {SITE.phoneDisplay}
                  </a>
                  <a href="#lead-final" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>
                    Получить презентацию
                  </a>
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </header>

      <main id="main-content" className="relative">
        <section className="section-pad relative" id="lead-main">
          <div className="lux-container hero-grid relative">
            <div>
              <Reveal>
                <span className="outline-chip">Сочи · Уч-Дере</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="title-xl mt-6 text-white">
                  ЛОК VERA. Апартаменты в курорте, где здоровье становится стандартом жизни
                </h1>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mt-6 max-w-xl text-lg text-white/72 md:text-xl">
                  Инвестиции в Сочи, построенные на синергии курортной недвижимости,
                  медицинского центра и wellness-туризма.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {trustChips.map((chip) => (
                    <span key={chip} className="chip">{chip}</span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.26}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href="#lead-final" className="btn-primary">Получить презентацию</a>
                  <a href="#invest" className="btn-ghost">Узнать условия инвестиций</a>
                </div>
              </Reveal>
            </div>

            <motion.div style={{ y: heroShift }}>
              <Reveal delay={0.12}>
                <div className="relative rounded-[30px] border border-white/10 bg-black/30 p-3 backdrop-blur-xl">
                  <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="image-frame min-h-[420px]">
                      <Image
                        src="/images/facade-day.jpg"
                        alt="ЛОК VERA фасад днем"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 46vw"
                      />
                      <p className="absolute bottom-4 left-4 z-10 text-xs uppercase tracking-[0.2em] text-white/78">
                        Дневной фасад
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <div className="image-frame min-h-[204px]">
                        <Image
                          src="/images/night-facade.jpg"
                          alt="ЛОК VERA фасад ночью"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 20vw"
                        />
                        <p className="absolute bottom-4 left-4 z-10 text-xs uppercase tracking-[0.2em] text-white/78">
                          Ночной силуэт
                        </p>
                      </div>
                      <div className="image-frame min-h-[204px]">
                        <Image
                          src="/images/resort-pool.jpg"
                          alt="ЛОК VERA курортная зона"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 20vw"
                        />
                        <p className="absolute bottom-4 left-4 z-10 text-xs uppercase tracking-[0.2em] text-white/78">
                          Курортная зона
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </motion.div>
          </div>
        </section>
        <section className="pb-6">
          <div className="lux-container">
            <div className="ticker-wrap">
              <div className="ticker-track">
                {[
                  "ИНВЕСТИЦИИ В СОЧИ",
                  "WELLNESS-ТУРИЗМ",
                  "МЕДИЦИНСКИЙ ТУРИЗМ",
                  "УЧ-ДЕРЕ НЕДВИЖИМОСТЬ",
                  "АПАРТАМЕНТЫ СОЧИ",
                  "КУРОРТНАЯ НЕДВИЖИМОСТЬ",
                  "ЛОК VERA",
                  "ИНВЕСТИЦИИ В СОЧИ",
                  "WELLNESS-ТУРИЗМ",
                  "МЕДИЦИНСКИЙ ТУРИЗМ",
                  "УЧ-ДЕРЕ НЕДВИЖИМОСТЬ",
                  "АПАРТАМЕНТЫ СОЧИ",
                  "КУРОРТНАЯ НЕДВИЖИМОСТЬ",
                  "ЛОК VERA",
                ].map((item, index) => (
                  <span key={`${item}-${index}`}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="section-pad">
          <div className="lux-container">
            <Reveal>
              <SectionTitle
                eyebrow="О проекте"
                title="Курортный продукт федерального масштаба"
                subtitle="ЛОК VERA объединяет медицинский туризм, wellness-формат и премиальную курортную недвижимость в Сочи. Это не просто апартаменты, а полноценная экосистема восстановления и статуса."
              />
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {keyFacts.map((fact, index) => (
                <Reveal key={fact.label} delay={0.08 * (index + 1)}>
                  <div className="feature-card h-full">
                    <p className="text-4xl text-[color:var(--gold)] md:text-5xl">{fact.value}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/60">{fact.label}</p>
                    <p className="mt-4 text-sm text-white/72">{fact.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="invest" className="section-pad">
          <div className="lux-container">
            <Reveal>
              <SectionTitle
                eyebrow="Инвестиционная модель"
                title="Недвижимость как актив в экономике здоровья"
                subtitle="Формат апартаментов позволяет использовать объект как личную резиденцию, инвестиционный актив или комбинированный сценарий."
              />
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {investmentScenarios.map((item, index) => (
                <Reveal key={item.title} delay={0.08 * (index + 1)}>
                  <div className="glass-panel-soft h-full">
                    <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--gold)]">{item.marker}</p>
                    <h3 className="mt-3 text-xl text-white">{item.title}</h3>
                    <p className="mt-3 text-sm text-white/70">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.22}>
              <div className="mt-8 glass-panel-soft">
                <div className="grid gap-4 md:grid-cols-3">
                  {investmentSignals.map((signal) => (
                    <div key={signal.title} className="metric">
                      <p className="kicker">{signal.title}</p>
                      <p className="mt-2 text-base text-white">{signal.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="signal-chip">Профессиональное сопровождение</span>
                  <span className="signal-chip">Условия уточняются персонально</span>
                  <span className="signal-chip">Актуальные условия предоставляются по запросу</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="medicine" className="section-pad">
          <div className="lux-container">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <Reveal>
                  <SectionTitle
                    eyebrow="Медицина и longevity"
                    title="Технологичная wellness-среда в партнерстве с ГК «Медскан»"
                    subtitle="Фокус проекта: профилактика, восстановление, долголетие и семейные форматы. Фокус на персонализированных программах и качестве сервиса."
                  />
                </Reveal>
                <div className="mt-8 space-y-4">
                  {medicalDirections.map((item, index) => (
                    <Reveal key={item.title} delay={0.07 * (index + 1)}>
                      <div className="glass-panel-soft">
                        <h3 className="text-lg text-white">{item.title}</h3>
                        <p className="mt-2 text-sm text-white/70">{item.text}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
              <Reveal delay={0.16}>
                <div className="image-frame min-h-[640px] rounded-[30px]">
                  <Image
                    src="/images/night-facade.jpg"
                    alt="ЛОК VERA вечерний вид"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-6 left-6 right-6 glass-panel-soft">
                    <p className="kicker">Концепция</p>
                    <p className="mt-2 text-lg text-white">
                      Здоровье как образ жизни и статусная курортная резиденция в Сочи.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="location" className="section-pad">
          <div className="lux-container">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <Reveal>
                <div className="image-frame min-h-[520px] rounded-[30px]">
                  <Image
                    src="/images/resort-pool.jpg"
                    alt="ЛОК VERA локация Уч-Дере"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </Reveal>
              <div>
                <Reveal delay={0.06}>
                  <SectionTitle
                    eyebrow="Локация"
                    title="Уч-Дере, Сочи: приватность, климат, инвестиционный потенциал"
                  />
                </Reveal>
                <Reveal delay={0.14}>
                  <p className="mt-6 text-base leading-relaxed text-white/74">
                    Уч-Дере в Лазаревском районе Сочи - это локация, где природный рельеф,
                    близость моря и мягкий климат формируют среду для wellness-туризма и
                    качественного отдыха. Именно такой контекст делает апартаменты Сочи
                    в формате ЛОК VERA интересными не только для проживания, но и как
                    курортную недвижимость с долгосрочной логикой владения.
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="mt-4 text-base leading-relaxed text-white/74">
                    Инвестиции в Сочи сегодня все чаще рассматриваются через сценарии,
                    где важны не только метры, но и инфраструктура, медицинский туризм,
                    уровень сервиса и статус проекта. ЛОК VERA интегрирует эти факторы
                    в единый продукт: личная резиденция, потенциальная аренда,
                    диверсификация капитала в сегменте экономики здоровья.
                  </p>
                </Reveal>
                <Reveal delay={0.26}>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="chip">апартаменты Сочи</span>
                    <span className="chip">Уч-Дере недвижимость</span>
                    <span className="chip">инвестиции в апартаменты</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="section-pad">
          <div className="lux-container">
            <Reveal>
              <SectionTitle
                eyebrow="FAQ"
                title="Ключевые вопросы перед заявкой"
              />
            </Reveal>
            <div className="mt-10 grid gap-4">
              {faqItems.map((item, index) => (
                <Reveal key={item.question} delay={0.04 * index}>
                  <details className="faq-item">
                    <summary className="cursor-pointer list-none text-lg text-white">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm text-white/72">{item.answer}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad pb-36 md:pb-40" id="lead-final">
          <div className="lux-container">
            <div className="soft-separator" />
            <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <Reveal>
                <div>
                  <p className="kicker">Финальный CTA</p>
                  <h2 className="title-lg mt-4 text-white">
                    Получите презентацию проекта «ЛОК VERA»
                  </h2>
                  <p className="mt-5 max-w-xl text-lg text-white/72">
                    Оставьте контакты - менеджер свяжется, покажет инвестиционные
                    сценарии и направит актуальные материалы.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="chip">Персональная консультация</span>
                    <span className="chip">Конфиденциально</span>
                    <span className="chip">Федеральный уровень проекта</span>
                  </div>
                  <a href={`tel:${SITE.phoneTel}`} className="mt-8 inline-block text-xl text-white">
                    {SITE.phoneDisplay}
                  </a>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <LeadForm
                  utm={utm}
                  id="lead-secondary"
                  title="Узнать условия инвестиций"
                  subtitle="Оставьте заявку, чтобы получить презентацию и условия участия."
                  buttonLabel="Отправить заявку"
                />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#070a10] py-10">
        <div className="lux-container flex flex-col gap-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-white/85">{SITE.project}</p>
            <p className="mt-2">{SITE.location}</p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <a href={`tel:${SITE.phoneTel}`} className="text-white">
              {SITE.phoneDisplay}
            </a>
            <p>Актуальные условия предоставляются по запросу.</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#05070e]/82 px-4 py-4 backdrop-blur-xl md:flex-row md:px-7">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/58">ЛОК VERA</p>
            <p className="text-base text-white">Получите презентацию и условия инвестиций</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href={`tel:${SITE.phoneTel}`} className="text-sm text-white">
              {SITE.phoneDisplay}
            </a>
            <a href="#lead-final" className="btn-primary">Оставить заявку</a>
          </div>
        </div>
      </div>
    </div>
  );
}

