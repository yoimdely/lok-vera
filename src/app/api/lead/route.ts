import { NextResponse } from "next/server";

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

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePayload(payload: unknown): LeadPayload {
  const source = payload && typeof payload === "object" ? payload : {};
  return {
    name: toText((source as Record<string, unknown>).name),
    phone: toText((source as Record<string, unknown>).phone),
    contact_method:
      toText((source as Record<string, unknown>).contact_method) || "Телефон",
    page_url: toText((source as Record<string, unknown>).page_url),
    utm_source: toText((source as Record<string, unknown>).utm_source),
    utm_medium: toText((source as Record<string, unknown>).utm_medium),
    utm_campaign: toText((source as Record<string, unknown>).utm_campaign),
    utm_term: toText((source as Record<string, unknown>).utm_term),
    utm_content: toText((source as Record<string, unknown>).utm_content),
  };
}

export async function POST(request: Request) {
  const rawPayload = await request.json().catch(() => null);
  const payload = normalizePayload(rawPayload);

  if (!payload.name || !payload.phone) {
    return NextResponse.json(
      {
        ok: false,
        message: "Missing required fields: name, phone",
      },
      { status: 400 }
    );
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    return NextResponse.json(
      {
        ok: false,
        message: "Telegram is not configured",
      },
      { status: 500 }
    );
  }

  const clientIp =
    request.headers
      .get("x-forwarded-for")
      ?.split(",")
      .map((part) => part.trim())
      .filter(Boolean)[0] ?? "unknown";

  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const submittedAt = new Date().toISOString();

  const optionalRows = [
    payload.utm_source ? `utm_source: ${payload.utm_source}` : "",
    payload.utm_medium ? `utm_medium: ${payload.utm_medium}` : "",
    payload.utm_campaign ? `utm_campaign: ${payload.utm_campaign}` : "",
    payload.utm_term ? `utm_term: ${payload.utm_term}` : "",
    payload.utm_content ? `utm_content: ${payload.utm_content}` : "",
  ].filter(Boolean);

  const text = [
    "Новая заявка с сайта вера-лок.рф",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Способ связи: ${payload.contact_method}`,
    `Страница: ${payload.page_url || "unknown"}`,
    `Время (UTC): ${submittedAt}`,
    `IP: ${clientIp}`,
    `User-Agent: ${userAgent}`,
    optionalRows.length ? "" : "",
    ...optionalRows,
  ]
    .filter((line, index, arr) => {
      if (!line && !arr[index - 1]) {
        return false;
      }
      return true;
    })
    .join("\n");

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      }
    );

    const telegramResult = await telegramResponse.json().catch(() => null);

    if (!telegramResponse.ok || !telegramResult?.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Failed to send lead to Telegram",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to send lead to Telegram",
      },
      { status: 502 }
    );
  }
}

