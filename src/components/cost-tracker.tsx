"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { GlassCard } from "./glass-card";
import { COST_DATA } from "@/lib/openclaw-data";

function CostTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { fill: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-zinc-200/60 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-sm dark:border-white/[0.08] dark:bg-zinc-900/95">
      <p className="text-xs font-medium text-zinc-500">{item.name}</p>
      <p className="text-sm font-bold text-zinc-900 font-data dark:text-white">
        ${item.value.toFixed(2)}
      </p>
    </div>
  );
}

export function CostTracker() {
  const budgetPct = Math.round((COST_DATA.thisMonth / COST_DATA.budget) * 100);
  const pieData = COST_DATA.byProvider
    .filter((p) => p.cost > 0)
    .map((p) => ({ name: p.provider, value: p.cost, color: p.color }));

  return (
    <GlassCard delay={0.35} glow="emerald">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
            <DollarSign size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Cost Tracking
            </h2>
            <p className="text-xs text-zinc-500">API spend by provider</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <TrendingDown size={14} />
          <span className="text-xs font-semibold">Under budget</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <CostKpi label="Today" value={`$${COST_DATA.today.toFixed(2)}`} />
        <CostKpi label="This Week" value={`$${COST_DATA.thisWeek.toFixed(2)}`} />
        <CostKpi label="This Month" value={`$${COST_DATA.thisMonth.toFixed(2)}`} highlight />
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
          <span>Monthly Budget</span>
          <span className="font-medium text-zinc-700 font-data dark:text-zinc-300">
            ${COST_DATA.thisMonth.toFixed(2)} / ${COST_DATA.budget}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${budgetPct}%` }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          />
        </div>
        <p className="mt-1 text-right text-[10px] text-zinc-400 font-data">
          {budgetPct}% used
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-[100px] w-[100px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={45}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CostTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {COST_DATA.byProvider.map((p) => (
            <div key={p.provider} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400">{p.provider}</span>
              </div>
              <span className="text-[11px] font-semibold text-zinc-700 font-data dark:text-zinc-300">
                {p.cost > 0 ? `$${p.cost.toFixed(2)}` : "Free"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function CostKpi({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-lg p-2 text-center ${
        highlight
          ? "bg-emerald-50 dark:bg-emerald-500/[0.08]"
          : "bg-zinc-50 dark:bg-white/[0.03]"
      }`}
    >
      <p className="text-[10px] text-zinc-500">{label}</p>
      <p
        className={`text-sm font-bold font-data ${
          highlight
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-zinc-800 dark:text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
