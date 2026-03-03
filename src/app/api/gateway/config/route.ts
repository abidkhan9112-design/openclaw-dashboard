import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const STATE_DIR = process.env.OPENCLAW_DATA_DIR || "/data";
const STATE_FILE = join(STATE_DIR, "dashboard-state.json");

async function readState(): Promise<Record<string, unknown>> {
  try {
    const raw = await readFile(STATE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeState(state: Record<string, unknown>) {
  if (!existsSync(STATE_DIR)) {
    await mkdir(STATE_DIR, { recursive: true });
  }
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

export async function GET() {
  const state = await readState();
  return NextResponse.json(state);
}

export async function PATCH(req: Request) {
  try {
    const patch = await req.json();
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
