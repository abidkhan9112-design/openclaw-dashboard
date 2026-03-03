import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const STATE_DIR = process.env.OPENCLAW_DATA_DIR || "/data";
const STATE_FILE = join(STATE_DIR, "dashboard-state.json");
const MAX_STATE_SIZE = 64 * 1024; // 64KB max

async function readState(): Promise<Record<string, unknown>> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeState(state: Record<string, unknown>) {
  const json = JSON.stringify(state, null, 2);
  if (json.length > MAX_STATE_SIZE) {
    throw new Error("State too large");
  }
  if (!existsSync(STATE_DIR)) {
    await mkdir(STATE_DIR, { recursive: true });
  }
  await writeFile(STATE_FILE, json);
}

export async function GET() {
  const state = await readState();
  return NextResponse.json(state);
}

export async function PATCH(req: NextRequest) {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_STATE_SIZE) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const patch = await req.json();

    // Only allow plain objects, not arrays or primitives
    if (typeof patch !== "object" || patch === null || Array.isArray(patch)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const current = await readState();
    const merged = { ...current, ...patch, updatedAt: new Date().toISOString() };
    await writeState(merged);
    return NextResponse.json({ ok: true, state: merged });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
