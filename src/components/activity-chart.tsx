"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { GlassCard } from "./glass-card";
import { generateActivityData } from "@/lib/openclaw-data";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-200/60 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm dark:border-white/[0.08] dark:bg-zinc-900/95">
      <p className="mb-1 text-xs font-medium text-zinc-500 font-data">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {p.name}:
          </span>
          <span className="text-xs font-bold text-zinc-900 font-data dark:text-white">
            {p.value} msgs
          </span>
        </div>
      ))}
    </div>
  );
}

export function ActivityChart() {
  const data = useMemo(() => generateActivityData(), []);
  const totalToday = data.reduce((sum, d) => sum + d.total, 0);
  const peak = Math.max(...data.map((d) => d.total));

  return (
    <GlassCard delay={0.3} glow="emerald">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Message Activity
            </h2>
            <p className="text-xs text-zinc-500">Last 24 hours</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-zinc-900 font-data dark:text-zinc-100">
              {totalToday}
            </p>
            <p className="text-[10px] text-zinc-500">Total messages</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              <p className="text-sm font-bold text-emerald-600 font-data dark:text-emerald-400">
                {peak}
              </p>
            </div>
            <p className="text-[10px] text-zinc-500">Peak/hour</p>
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tg-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sl-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-zinc-200 dark:text-zinc-800/50"
            />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
              className="text-zinc-400"
              stroke="currentColor"
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
              className="text-zinc-400"
              stroke="currentColor"
              width={30}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="telegram"
              name="Telegram"
              stroke="#22d3ee"
              fill="url(#tg-grad)"
              strokeWidth={2}
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="slack"
              name="Slack"
              stroke="#a855f7"
              fill="url(#sl-grad)"
              strokeWidth={2}
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-5">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-[11px] text-zinc-500">Telegram</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-violet-500" />
          <span className="text-[11px] text-zinc-500">Slack</span>
        </div>
      </div>
    </GlassCard>
  );
}
