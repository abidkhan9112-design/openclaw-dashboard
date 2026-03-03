import { NextResponse } from "next/server";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || "http://localhost:18789";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // GET the gateway root — if it responds (even with HTML), it's alive.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(GATEWAY_URL, {
      method: "GET",
      signal: controller.signal,
      // Prevent caching
      headers: { "Cache-Control": "no-cache" },
    });

    clearTimeout(timeout);

    if (res.ok || res.status < 500) {
      return NextResponse.json({
        ok: true,
        status: "online",
        checkedAt: new Date().toISOString(),
      });
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
