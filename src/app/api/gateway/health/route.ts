import { NextResponse } from "next/server";

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || "http://localhost:18789";

export async function GET() {
  try {
    // OpenClaw gateway serves its web UI on GET/HEAD — if it responds, it's alive.
    // We use HEAD to avoid downloading the full HTML body.
    const res = await fetch(GATEWAY_URL, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
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
