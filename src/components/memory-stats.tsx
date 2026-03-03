"use client";

import { motion } from "framer-motion";
import { Brain, HardDrive, Search, Clock } from "lucide-react";
import { GlassCard } from "./glass-card";
import { MEMORY } from "@/lib/openclaw-data";

export function MemoryStats() {
  const usagePct = Math.round(
    (MEMORY.volumeUsedMB / MEMORY.volumeTotalMB) * 100
  );

  return (
    <GlassCard delay={0.35} glow="rose">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Memory System
          </h2>
          <p className="text-xs text-zinc-500">{MEMORY.backend}</p>
        </div>
      </div>

      <div className="space-y-4">
        <StatRow
          icon={<Search size={14} />}
          label="Indexed Documents"
          value={MEMORY.indexedDocuments.toLocaleString()}
          color="text-cyan-500"
        />
        <StatRow
          icon={<Clock size={14} />}
          label="Search Latency"
          value={`${MEMORY.searchLatencyMs}ms`}
          color="text-emerald-500"
        />
        <StatRow
          icon={<Brain size={14} />}
          label="Embedding Model"
          value={MEMORY.model}
          color="text-violet-500"
        />

        {/* Volume usage bar */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-zinc-500">
              <HardDrive size={14} />
              <span className="text-xs">Volume Storage</span>
            </div>
            <span className="text-xs font-medium text-zinc-600 font-data dark:text-zinc-400">
              {MEMORY.volumeUsedMB}MB / {(MEMORY.volumeTotalMB / 1024).toFixed(0)}GB
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePct}%` }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-zinc-400 font-data">
            {usagePct}% used
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <ConfigBadge active={MEMORY.sessionMemory} label="Session Memory" />
          <ConfigBadge active label={`TTL: ${MEMORY.cacheTTL}`} />
        </div>
      </div>
    </GlassCard>
  );
}

function StatRow({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className={`text-sm font-bold font-data ${color}`}>{value}</span>
    </div>
  );
}

function ConfigBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-medium font-data ${
        active
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
      }`}
    >
      {active ? "ON" : "OFF"} · {label}
    </span>
  );
}
