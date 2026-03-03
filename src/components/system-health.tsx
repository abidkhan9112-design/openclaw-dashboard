"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, HardDrive, Activity, Users, Radio, WifiOff, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { StatusPulse } from "./status-pulse";
import { SYSTEM_HEALTH, GATEWAY } from "@/lib/openclaw-data";

export function SystemHealth() {
  const [gatewayOnline, setGatewayOnline] = useState<boolean | null>(null);

  useEffect(() => {
    function check() {
      fetch("/api/gateway/health")
        .then((r) => r.json())
        .then((d) => setGatewayOnline(d.ok === true))
        .catch(() => setGatewayOnline(false));
    }
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard delay={0.4} glow="blue">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
          <Activity size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            System Health
          </h2>
          <p className="text-xs text-zinc-500 font-data">
            Gateway :{GATEWAY.port} · {GATEWAY.mode}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <MetricBar
          icon={<Cpu size={14} />}
          label="CPU"
          value={SYSTEM_HEALTH.cpuUsage}
          max={100}
          unit="%"
          color="from-cyan-500 to-blue-400"
          glowColor="rgba(34,211,238,0.3)"
        />
        <MetricBar
          icon={<HardDrive size={14} />}
          label="Memory"
          value={SYSTEM_HEALTH.memoryUsageMB}
          max={SYSTEM_HEALTH.memoryTotalMB}
          unit="MB"
          color="from-violet-500 to-purple-400"
          glowColor="rgba(168,85,247,0.3)"
        />

        <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-zinc-500">
            <Users size={14} />
            <span className="text-xs">Active Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-800 font-data dark:text-zinc-200">
              {SYSTEM_HEALTH.activeAgents} / {SYSTEM_HEALTH.maxConcurrent}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: SYSTEM_HEALTH.maxConcurrent }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    i < SYSTEM_HEALTH.activeAgents
                      ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-zinc-500">
            <Users size={14} />
            <span className="text-xs">Subagents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-800 font-data dark:text-zinc-200">
              {SYSTEM_HEALTH.subagentsConcurrent} / {SYSTEM_HEALTH.maxSubagents}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: SYSTEM_HEALTH.maxSubagents }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    i < SYSTEM_HEALTH.subagentsConcurrent
                      ? "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic heartbeat indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500">
            <Radio size={14} />
            <span className="text-xs">Gateway</span>
          </div>
          <div className="flex items-center gap-2">
            {gatewayOnline === true && (
              <>
                <Wifi size={12} className="text-emerald-500" />
                <StatusPulse status="online" size="sm" glow />
                <span className="text-xs text-emerald-600 font-data dark:text-emerald-400">
                  Connected
                </span>
              </>
            )}
            {gatewayOnline === false && (
              <>
                <WifiOff size={12} className="text-red-500" />
                <StatusPulse status="offline" size="sm" />
                <span className="text-xs text-red-500 font-data">
                  Unreachable
                </span>
              </>
            )}
            {gatewayOnline === null && (
              <>
                <StatusPulse status="idle" size="sm" />
                <span className="text-xs text-zinc-400 font-data">
                  Checking...
                </span>
              </>
            )}
          </div>
        </div>

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
  glowColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  glowColor: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-500">
          {icon}
          <span className="text-xs">{label}</span>
        </div>
        <span className="text-xs font-medium text-zinc-600 font-data dark:text-zinc-400">
          {value}{unit} / {max}{unit}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          className={cn("h-2 rounded-full bg-gradient-to-r", color)}
          style={{ boxShadow: `0 0 8px ${glowColor}` }}
        />
      </div>
    </div>
  );
}

function GatewayBadge({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-zinc-200/60 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500 font-data dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-zinc-400">
      {label}
    </span>
  );
}
