import { NextRequest, NextResponse } from "next/server";

// ============================================================
// Railway Deployment Webhook → Telegram Notification
// ============================================================
//
// SETUP:
// 1. Set these environment variables on Railway:
//    TELEGRAM_BOT_TOKEN=your_bot_token_here
//    TELEGRAM_CHAT_ID=your_chat_id_here
//
// 2. In Railway → Project → Settings → Webhooks:
//    Add: https://your-dashboard.up.railway.app/api/webhook/railway
// ============================================================

interface RailwayPayload {
  type?: string;
  timestamp?: string;
  project?: { id?: string; name?: string };
  environment?: { id?: string; name?: string };
  deployment?: {
    id?: string;
    status?: string;
    meta?: {
      repo?: string;
      branch?: string;
      commitMessage?: string;
      commitAuthor?: string;
    };
  };
  [key: string]: unknown;
}

async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return false;
  }

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    }
  );

  if (!res.ok) {
    console.error("Telegram API error:", await res.text());
    return false;
  }
  return true;
}

function escapeHtml(t: string): string {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMessage(p: RailwayPayload): string {
  const status = p.deployment?.status?.toUpperCase() || "UNKNOWN";
  const project = p.project?.name || "Unknown";
  const env = p.environment?.name || "production";
  const branch = p.deployment?.meta?.branch || "main";
  const commit = p.deployment?.meta?.commitMessage || "No message";
  const author = p.deployment?.meta?.commitAuthor || "Unknown";
  const time = p.timestamp
    ? new Date(p.timestamp).toLocaleString("en-GB", { timeZone: "Europe/London" })
    : new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });

  const emoji =
    status === "SUCCESS" ? "✅" : status === "FAILED" || status === "CRASHED" ? "❌" : "🔄";

  return [
    `${emoji} <b>Railway Deploy: ${status}</b>`,
    ``,
    `<b>Project:</b> ${escapeHtml(project)}`,
    `<b>Env:</b> ${env} · <b>Branch:</b> ${branch}`,
    `<b>Author:</b> ${escapeHtml(author)}`,
    `<b>Commit:</b> <i>${escapeHtml(commit)}</i>`,
    `<b>Time:</b> ${time}`,
    ``,
    status === "SUCCESS" ? `🚀 Live now!` : status === "FAILED" ? `⚠️ Check logs.` : `⏳ In progress...`,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const payload: RailwayPayload = await request.json();
    console.log("Railway webhook:", JSON.stringify(payload, null, 2));

    const msg = formatMessage(payload);
    const sent = await sendTelegram(msg);

    if (!sent) {
      return NextResponse.json({ ok: false, error: "Telegram send failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ ok: false, error: "Bad payload" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/webhook/railway",
    status: "active",
    telegram_configured:
      !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID,
  });
}
