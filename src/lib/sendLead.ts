import siteConfig from "../../site.config.json";

export type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  source?: string;
  message?: string;
  quiz?: Record<string, unknown> | string;
  hp?: string;
  pageUrl?: string;
  siteHost?: string;
  utm?: Record<string, string>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

type SiteConfig = {
  siteId: string;
  siteUrl: string;
  chatId: string;
};

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyGL5Y4gBm9-2V_bBsT8QOmRwiJ1-sHOjnCOfYfzHeEXh-_FmeMsqISHJGEhrE1-8sV/exec";
const REQUEST_TIMEOUT_MS = 10000;

const FIELD_LIMITS = {
  siteId: 80,
  siteUrl: 255,
  chatId: 80,
  name: 100,
  phone: 30,
  email: 120,
  source: 80,
  message: 4000,
  quiz: 12000,
  pageUrl: 1500,
  siteHost: 255,
  hp: 255,
  utm: 120,
} as const;

const SITE_CONFIG = siteConfig as SiteConfig;

function clean(value: unknown, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function getUrlUtm() {
  if (typeof window === "undefined") {
    return {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
    };
  }

  const search = new URLSearchParams(window.location.search);

  return {
    utm_source: search.get("utm_source") ?? "",
    utm_medium: search.get("utm_medium") ?? "",
    utm_campaign: search.get("utm_campaign") ?? "",
    utm_content: search.get("utm_content") ?? "",
    utm_term: search.get("utm_term") ?? "",
  };
}

function normalizeUtm(payload: LeadPayload) {
  const fromPayload = payload.utm ?? {};
  const fromUrl = getUrlUtm();

  return {
    utm_source: clean(payload.utm_source ?? fromPayload.utm_source ?? fromUrl.utm_source, FIELD_LIMITS.utm),
    utm_medium: clean(payload.utm_medium ?? fromPayload.utm_medium ?? fromUrl.utm_medium, FIELD_LIMITS.utm),
    utm_campaign: clean(payload.utm_campaign ?? fromPayload.utm_campaign ?? fromUrl.utm_campaign, FIELD_LIMITS.utm),
    utm_content: clean(payload.utm_content ?? fromPayload.utm_content ?? fromUrl.utm_content, FIELD_LIMITS.utm),
    utm_term: clean(payload.utm_term ?? fromPayload.utm_term ?? fromUrl.utm_term, FIELD_LIMITS.utm),
  };
}

function normalizeQuiz(quiz: LeadPayload["quiz"]) {
  if (!quiz) {
    return "";
  }

  if (typeof quiz === "string") {
    return clean(quiz, FIELD_LIMITS.quiz);
  }

  try {
    return clean(JSON.stringify(quiz), FIELD_LIMITS.quiz);
  } catch {
    return "";
  }
}

export async function sendLead(payload: LeadPayload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const pageUrl = clean(
    payload.pageUrl ?? (typeof window !== "undefined" ? window.location.href : ""),
    FIELD_LIMITS.pageUrl,
  );
  const siteHost = clean(
    payload.siteHost ?? (typeof window !== "undefined" ? window.location.hostname : ""),
    FIELD_LIMITS.siteHost,
  );

  const utm = normalizeUtm(payload);
  const quiz = normalizeQuiz(payload.quiz);

  const flatPayload: Record<string, string> = {
    siteId: clean(SITE_CONFIG.siteId, FIELD_LIMITS.siteId),
    siteUrl: clean(SITE_CONFIG.siteUrl, FIELD_LIMITS.siteUrl),
    chatId: clean(SITE_CONFIG.chatId, FIELD_LIMITS.chatId),
    name: clean(payload.name, FIELD_LIMITS.name),
    phone: clean(payload.phone, FIELD_LIMITS.phone),
    email: clean(payload.email, FIELD_LIMITS.email),
    source: clean(payload.source ?? "lead", FIELD_LIMITS.source),
    message: clean(payload.message, FIELD_LIMITS.message),
    hp: clean(payload.hp, FIELD_LIMITS.hp),
    pageUrl,
    siteHost,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_term: utm.utm_term,
  };

  if (quiz) {
    flatPayload.quiz = quiz;
  }

  const body = new URLSearchParams(flatPayload).toString();

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Lead request failed: HTTP ${response.status}; body=${responseText.slice(0, 300)}`);
    }

    return { ok: true };
  } finally {
    clearTimeout(timeoutId);
  }
}

