// ============================================================
// OpenClaw Mission Control — All Bot Configuration Data
// Sourced from the live openclaw.json + deployment config
// ============================================================

export type ChannelStatus = "online" | "degraded" | "offline";
export type ModelStatus = "active" | "fallback" | "cooldown" | "error";
export type SkillCategory = "productivity" | "trading" | "content" | "system";

// ─── Channels ────────────────────────────────────────────────

export interface Channel {
  id: string;
  name: string;
  platform: "telegram" | "slack" | "whatsapp";
  handle: string;
  status: ChannelStatus;
  policy: string;
  streamMode: string;
  messagesLast24h: number;
  avgResponseMs: number;
  lastActive: string;
  icon: string;
}

export const CHANNELS: Channel[] = [
  {
    id: "telegram",
    name: "Telegram",
    platform: "telegram",
    handle: "@Abod9112bot",
    status: "online",
    policy: "allowlist",
    streamMode: "partial",
    messagesLast24h: 47,
    avgResponseMs: 2100,
    lastActive: "2 min ago",
    icon: "telegram",
  },
  {
    id: "slack",
    name: "Slack",
    platform: "slack",
    handle: "Katobot 2",
    status: "online",
    policy: "allowlist",
    streamMode: "socket",
    messagesLast24h: 23,
    avgResponseMs: 1800,
    lastActive: "15 min ago",
    icon: "slack",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    platform: "whatsapp",
    handle: "+447957312862",
    status: "offline",
    policy: "allowlist",
    streamMode: "block",
    messagesLast24h: 0,
    avgResponseMs: 0,
    lastActive: "Local only",
    icon: "whatsapp",
  },
];

// ─── AI Model Stack ──────────────────────────────────────────

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  role: "primary" | "fallback" | "subagent";
  status: ModelStatus;
  costPer1kTokens: number;
  avgLatencyMs: number;
  priority: number;
  color: string;
}

export const MODELS: AIModel[] = [
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "Google",
    role: "primary",
    status: "active",
    costPer1kTokens: 0,
    avgLatencyMs: 1800,
    priority: 1,
    color: "#4285f4",
  },
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    provider: "Google",
    role: "fallback",
    status: "active",
    costPer1kTokens: 0,
    avgLatencyMs: 800,
    priority: 2,
    color: "#34a853",
  },
  {
    id: "gpt-5.2-codex",
    name: "GPT-5.2 Codex",
    provider: "OpenAI",
    role: "fallback",
    status: "active",
    costPer1kTokens: 0.003,
    avgLatencyMs: 2200,
    priority: 3,
    color: "#10a37f",
  },
  {
    id: "claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    role: "fallback",
    status: "active",
    costPer1kTokens: 0.003,
    avgLatencyMs: 1500,
    priority: 4,
    color: "#d97706",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    role: "subagent",
    status: "active",
    costPer1kTokens: 0.001,
    avgLatencyMs: 1200,
    priority: 5,
    color: "#7c3aed",
  },
  {
    id: "minimax-m2.5",
    name: "MiniMax M2.5",
    provider: "MiniMax",
    role: "fallback",
    status: "active",
    costPer1kTokens: 0,
    avgLatencyMs: 2400,
    priority: 6,
    color: "#ec4899",
  },
];

// ─── Skills ──────────────────────────────────────────────────

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  status: "active" | "idle" | "error";
  usageLast24h: number;
  icon: string;
}

export const SKILLS: Skill[] = [
  {
    id: "gogcli",
    name: "Google Workspace",
    description: "Gmail, Calendar, Drive, Sheets, Docs",
    category: "productivity",
    status: "active",
    usageLast24h: 12,
    icon: "mail",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Native Slack messaging integration",
    category: "productivity",
    status: "active",
    usageLast24h: 8,
    icon: "hash",
  },
  {
    id: "firecrawl",
    name: "Firecrawl",
    description: "AI web scraping with JS rendering",
    category: "content",
    status: "active",
    usageLast24h: 5,
    icon: "globe",
  },
  {
    id: "hyperliquid",
    name: "Hyperliquid",
    description: "DEX trading & market analysis",
    category: "trading",
    status: "active",
    usageLast24h: 18,
    icon: "trending-up",
  },
  {
    id: "moltrade",
    name: "Moltrade",
    description: "Advanced trading bot, alpha arena",
    category: "trading",
    status: "active",
    usageLast24h: 14,
    icon: "bar-chart-2",
  },
  {
    id: "tradingview",
    name: "TradingView",
    description: "Signal analysis & screener",
    category: "trading",
    status: "active",
    usageLast24h: 9,
    icon: "activity",
  },
  {
    id: "breadth-chart",
    name: "Breadth Analyst",
    description: "Market breadth chart analysis",
    category: "trading",
    status: "idle",
    usageLast24h: 2,
    icon: "pie-chart",
  },
  {
    id: "market-env",
    name: "Market Environment",
    description: "Macro environment scoring",
    category: "trading",
    status: "idle",
    usageLast24h: 1,
    icon: "compass",
  },
  {
    id: "danube-tools",
    name: "Danube Tools",
    description: "100+ API integrations",
    category: "content",
    status: "active",
    usageLast24h: 7,
    icon: "zap",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    description: "Post & analyze on X.com",
    category: "content",
    status: "active",
    usageLast24h: 4,
    icon: "at-sign",
  },
  {
    id: "sag",
    name: "SAG",
    description: "SAG API integration",
    category: "content",
    status: "idle",
    usageLast24h: 0,
    icon: "database",
  },
  {
    id: "qmd",
    name: "QMD Memory",
    description: "SQLite hybrid search backend",
    category: "system",
    status: "active",
    usageLast24h: 47,
    icon: "brain",
  },
  {
    id: "community",
    name: "Community Skills",
    description: "Community package registry",
    category: "system",
    status: "active",
    usageLast24h: 3,
    icon: "users",
  },
];

// ─── Gateway Config ──────────────────────────────────────────

export const GATEWAY = {
  port: 18789,
  mode: "local" as const,
  bind: "loopback" as const,
  auth: "token" as const,
  rateLimit: { maxAttempts: 10, windowMs: 60000 },
  healthEndpoint: "/health",
  uptime: 99.7,
  lastRestart: "2026-02-27T03:15:00Z",
};

// ─── Memory Backend ──────────────────────────────────────────

export const MEMORY = {
  backend: "QMD (SQLite Hybrid Search)",
  model: "embedding-gemma-300m",
  indexedDocuments: 1247,
  searchLatencyMs: 45,
  sessionMemory: true,
  cacheTTL: "1h",
  volumeUsedMB: 312,
  volumeTotalMB: 5120,
};

// ─── Deployment Info ─────────────────────────────────────────

export const DEPLOYMENT = {
  platform: "Railway",
  service: "abot-2-0",
  repo: "abidkhan9112-design/abot",
  branch: "main",
  lastDeploy: "2026-02-28T10:30:00Z",
  lastCommit: "fix: update model routing priorities",
  buildTimeSeconds: 180,
  status: "live" as const,
  region: "us-west",
  autoDeploy: true,
};

// ─── Simulated Activity Data (message throughput) ────────────

export function generateActivityData() {
  const hours = 24;
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    // Simulate realistic traffic pattern (quiet at night, peaks in afternoon)
    const baseTraffic =
      hour >= 9 && hour <= 22
        ? 3 + Math.sin(((hour - 9) / 13) * Math.PI) * 5
        : 0.5;
    const telegram = Math.round(baseTraffic * (0.8 + Math.random() * 0.6));
    const slack = Math.round(baseTraffic * (0.4 + Math.random() * 0.4));
    data.push({
      time: time.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      hour: `${hour}:00`,
      telegram,
      slack,
      total: telegram + slack,
    });
  }
  return data;
}

// ─── Simulated Cost Data ─────────────────────────────────────

export const COST_DATA = {
  today: 0.12,
  thisWeek: 0.67,
  thisMonth: 2.84,
  budget: 30,
  byProvider: [
    { provider: "Google", cost: 0, pct: 0, color: "#4285f4" },
    { provider: "OpenAI", cost: 1.42, pct: 50, color: "#10a37f" },
    { provider: "Anthropic", cost: 0.89, pct: 31, color: "#d97706" },
    { provider: "DeepSeek", cost: 0.34, pct: 12, color: "#7c3aed" },
    { provider: "MiniMax", cost: 0.19, pct: 7, color: "#ec4899" },
  ],
};

// ─── System Health ───────────────────────────────────────────

export const SYSTEM_HEALTH = {
  cpuUsage: 23,
  memoryUsageMB: 412,
  memoryTotalMB: 1024,
  diskUsedMB: 312,
  diskTotalMB: 5120,
  activeAgents: 2,
  maxConcurrent: 4,
  subagentsConcurrent: 3,
  maxSubagents: 8,
  heartbeatInterval: "30m",
  heartbeatModel: "MiniMax M2.1",
  lastHeartbeat: "12 min ago",
  cronEnabled: true,
};
