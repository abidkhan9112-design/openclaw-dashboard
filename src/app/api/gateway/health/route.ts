import { NextResponse } from "next/server";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || "http://localhost:18789";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || "";

export async function GET() {
  try {
    const res = await fetch(`${GATEWAY_URL}/health`, {
      headers: GATEWAY_TOKEN
        ? { Authorization: `Bearer ${GATEWAY_TOKEN}` }
        : {},
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Gateway returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, ...data });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gateway unreachable" },
      { status: 503 }
    );
  }
}
