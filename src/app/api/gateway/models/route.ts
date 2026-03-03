import { NextResponse } from "next/server";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || "http://localhost:18789";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || "";

export interface ModelStatusResult {
  id: string;
  available: boolean;
  reason: string;
  latencyMs?: number;
}

export async function GET() {
  try {
    // Try gateway's /v1/models endpoint first (OpenAI-compatible)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (GATEWAY_TOKEN) {
      headers["Authorization"] = `Bearer ${GATEWAY_TOKEN}`;
    }

    const res = await fetch(`${GATEWAY_URL}/v1/models`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json();
      // OpenClaw gateway returns model info if available
      return NextResponse.json({ ok: true, models: data.data || data });
    }

    // Fallback: try health endpoint to check basic connectivity
    const healthRes = await fetch(`${GATEWAY_URL}/health`, {
      headers,
      signal: AbortSignal.timeout(5000),
    });

    if (healthRes.ok) {
      const healthData = await healthRes.json();
      return NextResponse.json({
        ok: true,
        gatewayOnline: true,
        health: healthData,
        models: null, // Models endpoint not available but gateway is alive
      });
    }

    return NextResponse.json(
      { ok: false, error: "Gateway returned error", gatewayOnline: false },
      { status: 502 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gateway unreachable", gatewayOnline: false },
      { status: 503 }
    );
  }
}
