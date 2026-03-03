import { NextResponse } from "next/server";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || "http://localhost:18789";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || "";

export async function GET() {
  try {
    // Quick connectivity check via HEAD (fast, no body)
    const headRes = await fetch(GATEWAY_URL, {
      method: "HEAD",
      signal: AbortSignal.timeout(6000),
    });

    if (!headRes.ok) {
      return NextResponse.json(
        { ok: false, error: `Gateway returned ${headRes.status}`, gatewayOnline: false },
        { status: 502 }
      );
    }

    // Gateway is alive — try a fast model check via chat completions
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (GATEWAY_TOKEN) headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;

    try {
      const start = Date.now();
      const chatRes = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "default",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 1,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const latencyMs = Date.now() - start;

      if (chatRes.ok) {
        const data = await chatRes.json();
        return NextResponse.json({
          ok: true,
          gatewayOnline: true,
          activeModel: data.model || "default",
          latencyMs,
          models: null,
        });
      }

      // Chat failed but gateway is up
      return NextResponse.json({
        ok: true,
        gatewayOnline: true,
        activeModel: null,
        chatError: `Chat returned ${chatRes.status}`,
        models: null,
      });
    } catch {
      // Chat timed out but gateway HEAD was fine
      return NextResponse.json({
        ok: true,
        gatewayOnline: true,
        activeModel: null,
        chatError: "Chat request timed out — models may be slow",
        models: null,
      });
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gateway unreachable", gatewayOnline: false },
      { status: 503 }
    );
  }
}
