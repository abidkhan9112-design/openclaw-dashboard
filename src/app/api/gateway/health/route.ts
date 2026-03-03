import { NextResponse } from "next/server";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || "http://localhost:18789";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || "";

export async function GET() {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (GATEWAY_TOKEN) {
      headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;
    }

    // OpenClaw's gateway serves HTML on GET, so we send a minimal
    // chat completion POST to verify the gateway is alive and responsive.
    const res = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "default",
        messages: [{ role: "user", content: "health check ping" }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true, status: "online", checkedAt: new Date().toISOString() });
    }

    // If POST fails but we get a response, the gateway is up but may have issues
    const text = await res.text().catch(() => "");
    const isHtml = text.startsWith("<!doctype") || text.startsWith("<html");

    if (isHtml) {
      // Gateway serving web UI — it's alive but the API path may be wrong
      return NextResponse.json({ ok: true, status: "online", note: "Web UI detected" });
    }

    return NextResponse.json(
      { ok: false, error: `Gateway returned ${res.status}` },
      { status: 502 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gateway unreachable" },
      { status: 503 }
    );
  }
}
