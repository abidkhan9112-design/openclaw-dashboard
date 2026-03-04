import { NextRequest, NextResponse } from "next/server";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || "http://localhost:18789";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || "";

export const dynamic = "force-dynamic";

// GET /api/gateway/models — check gateway connectivity
export async function GET() {
  try {
    const res = await fetch(GATEWAY_URL, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
      headers: { "Cache-Control": "no-cache" },
    });

    if (res.ok || res.status < 500) {
      return NextResponse.json({ ok: true, gatewayOnline: true });
    }

    return NextResponse.json({ ok: false, gatewayOnline: false }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, gatewayOnline: false }, { status: 503 });
  }
}

// POST /api/gateway/models — test a specific model
// Body: { modelId: string }
export async function POST(req: NextRequest) {
  try {
    const { modelId } = await req.json();
    if (!modelId || typeof modelId !== "string") {
      return NextResponse.json({ error: "modelId required" }, { status: 400 });
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (GATEWAY_TOKEN) headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;

    const start = Date.now();
    const res = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: "." }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(30000),
    });
    const latencyMs = Date.now() - start;

    if (res.ok) {
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "";
      return NextResponse.json({
        ok: true,
        modelId,
        status: "healthy",
        latencyMs,
        reason: `Model responded successfully in ${(latencyMs / 1000).toFixed(1)}s.`,
        reply: reply.slice(0, 100),
      });
    }

    // Parse error to give a human-readable reason
    const errorText = await res.text().catch(() => "");
    let reason = `Model returned HTTP ${res.status}.`;

    if (res.status === 401 || res.status === 403) {
      reason = "Authentication failed. The API key for this model's provider may be invalid or expired.";
    } else if (res.status === 429) {
      reason = "Rate limit exceeded. This model has hit its usage cap. Try again later or switch to another model.";
    } else if (res.status === 404) {
      reason = "Model not found. It may not be configured in the gateway or the model ID is incorrect.";
    } else if (res.status === 503) {
      reason = "Model service is temporarily unavailable. The provider may be experiencing downtime.";
    } else if (errorText.toLowerCase().includes("key")) {
      reason = `API key issue: ${errorText.slice(0, 200)}`;
    } else if (errorText.toLowerCase().includes("quota") || errorText.toLowerCase().includes("limit")) {
      reason = `Usage limit reached: ${errorText.slice(0, 200)}`;
    } else if (errorText) {
      reason = errorText.slice(0, 300);
    }

    return NextResponse.json({
      ok: false,
      modelId,
      status: res.status === 429 ? "degraded" : "error",
      latencyMs,
      reason,
    });
  } catch (err) {
    const isTimeout = String(err).includes("abort") || String(err).includes("timeout");
    return NextResponse.json({
      ok: false,
      modelId: "unknown",
      status: "unreachable",
      reason: isTimeout
        ? "Request timed out after 30 seconds. The model may be overloaded or the provider is experiencing high latency."
        : "Failed to connect to the gateway. The bot service may be down.",
    });
  }
}
