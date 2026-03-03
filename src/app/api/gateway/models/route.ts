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

    // OpenClaw doesn't expose a /v1/models GET endpoint — it returns HTML.
    // We verify the gateway is alive by sending a minimal chat completion.
    const start = Date.now();
    const res = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "default",
        messages: [{ role: "user", content: "model status check" }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(12000),
    });
    const latencyMs = Date.now() - start;

    if (res.ok) {
      const data = await res.json();
      const model = data.model || "default";
      return NextResponse.json({
        ok: true,
        gatewayOnline: true,
        activeModel: model,
        latencyMs,
        models: null, // Individual model status not available from gateway
      });
    }

    return NextResponse.json(
      { ok: false, error: `Gateway returned ${res.status}`, gatewayOnline: false },
      { status: 502 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gateway unreachable", gatewayOnline: false },
      { status: 503 }
    );
  }
}
