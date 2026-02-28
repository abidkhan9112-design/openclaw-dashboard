"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  HardDrive,
  Activity,
  Users,
  Timer,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { StatusPulse } from "./status-pulse";
import { SYSTEM_HEALTH, GATEWAY } from "@/lib/openclaw-data";

export function SystemHealth() {
  return (
    <GlassCard delay={0.7}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
          <Activity size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            System Health
          </h2>
          <p className="text-xs text-zinc-500">
            Gateway :{GATEWAY.port} · {GATEWAY.mode}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* CPU */}
        <MetricBar
          icon={<Cpu size={14} />}
          label="CPU"
          value={SYSTEM_HEALTH.cpuUsage}
          max={100}
          unit="%"
          color="from-blue-500 to-cyan-400"
        />

        {/* Memory */}
        <MetricBar
          icon={<HardDrive size={14} />}
          label="Memory"
          value={SYSTEM_HEALTH.memoryUsageMB}
          max={SYSTEM_HEALTH.memoryTotalMB}
          unit="MB"
          color="from-violet-500 to-purple-400"
        />

        {/* Agents */}
        <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-zinc-500">
            <Users size={14} />
            <span className="text-xs">Active Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {SYSTEM_HEALTH.activeAgents} / {SYSTEM_HEALTH.maxConcurrent}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: SYSTEM_HEALTH.maxConcurrent }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    i < SYSTEM_HEALTH.activeAgents
                      ? "bg-emerald-500"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Subagents */}
        <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-zinc-500">
            <Users size={14} />
            <span className="text-xs">Subagents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {SYSTEM_HEALTH.subagentsConcurrent} / {SYSTEM_HEALTH.maxSubagents}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: SYSTEM_HEALTH.maxSubagents }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    i < SYSTEM_HEALTH.subagentsConcurrent
                      ? "bg-amber-500"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Heartbeat */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500">
            <Radio size={14} />
            <span className="text-xs">Heartbeat</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusPulse status="online" size="sm" />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              {SYSTEM_HEALTH.lastHeartbeat} · every {SYSTEM_HEALTH.heartbeatInterval}
            </span>
          </div>
        </div>

        {/* Gateway config */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <GatewayBadge label={`Port ${GATEWAY.port}`} />
          <GatewayBadge label={GATEWAY.auth} />
          <GatewayBadge label={`Rate: ${GATEWAY.rateLimit.maxAttempts}/min`} />
          <GatewayBadge label={`Cron ${SYSTEM_HEALTH.cronEnabled ? "ON" : "OFF"}`} />
        </div>
      </div>
    </GlassCard>
  );
}

function MetricBar({
  icon,
  label,
  value,
  max,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-500">
          {icon}
          <span className="text-xs">{label}</span>
        </div>
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {value}{unit} / {max}{unit}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          className={cn("h-2 rounded-full bg-gradient-to-r", color)}
        />
      </div>
    </div>
  );
}

function GatewayBadge({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-zinc-200/60 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-zinc-400">
      {label}
    </span>
  );
}
