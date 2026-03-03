"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Zap, Clock, MessageSquare, Brain, Shield, WifiOff } from "lucide-react";
import { StatusPulse } from "../status-pulse";
import { GATEWAY, MEMORY, CHANNELS, MODELS, SKILLS, COST_DATA } from "@/lib/openclaw-data";

export function HeroStatus() {
  const totalMessages = CHANNELS.reduce((sum, c) => sum + c.messagesLast24h, 0);
  const activeSkills = SKILLS.filter((s) => s.status === "active").length;
  const primaryModel = MODELS.find((m) => m.role === "primary");
  const [gatewayOnline, setGatewayOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/gateway/health")
      .then((r) => r.json())
      .then((d) => setGatewayOnline(d.ok === true))
      .catch(() => setGatewayOnline(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-gradient-to-br from-white/80 via-white/60 to-cyan-50/30 p-6 backdrop-blur-xl dark:border-white/[0.06] dark:from-[rgba(15,23,42,0.6)] dark:via-[rgba(15,23,42,0.4)] dark:to-cyan-950/20"
    >
      {/* Decorative glow */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-[80px] dark:bg-cyan-500/[0.08]" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-violet-500/10 blur-[80px] dark:bg-violet-500/[0.06]" />

      <div className="relative">
        {/* Top row */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/25">
              <Bot size={24} className="text-white" />
              <div className="absolute -bottom-0.5 -right-0.5">
                <StatusPulse status={gatewayOnline ? "online" : gatewayOnline === false ? "offline" : "idle"} size="md" glow />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                OpenClaw{" "}
                <span className="neon-text-gradient">Mission Control</span>
              </h1>
              <p className="text-xs text-zinc-500">
                {CHANNELS.filter((c) => c.status === "online").length} channels online · {activeSkills} skills active · {GATEWAY.uptime}% uptime
              </p>
            </div>
          </div>

          {gatewayOnline === true && (
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1.5 sm:flex dark:border-emerald-500/20 dark:bg-emerald-500/[0.08]">
              <Zap size={12} className="text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                System Healthy
              </span>
              <StatusPulse status="online" size="sm" />
            </div>
          )}
          {gatewayOnline === false && (
            <div className="hidden items-center gap-2 rounded-full border border-red-200/60 bg-red-50/80 px-3 py-1.5 sm:flex dark:border-red-500/20 dark:bg-red-500/[0.08]">
              <WifiOff size={12} className="text-red-500" />
              <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                Gateway Offline
              </span>
            </div>
          )}
          {gatewayOnline === null && (
            <div className="hidden items-center gap-2 rounded-full border border-zinc-200/60 bg-zinc-50/80 px-3 py-1.5 sm:flex dark:border-zinc-500/20 dark:bg-zinc-500/[0.08]">
              <Zap size={12} className="text-zinc-400 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Checking...
              </span>
            </div>
          )}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <QuickMetric
            icon={<MessageSquare size={14} />}
            label="Messages 24h"
            value={totalMessages.toString()}
            color="cyan"
          />
          <QuickMetric
            icon={<Shield size={14} />}
            label="Active Skills"
            value={activeSkills.toString()}
            color="violet"
          />
          <QuickMetric
            icon={<Zap size={14} />}
            label="Primary Model"
            value={primaryModel?.name.split(" ").slice(0, 2).join(" ") || "—"}
            color="blue"
            mono
          />
          <QuickMetric
            icon={<Brain size={14} />}
            label="Memory Docs"
            value={MEMORY.indexedDocuments.toLocaleString()}
            color="emerald"
          />
          <QuickMetric
            icon={<Clock size={14} />}
            label="Avg Response"
            value="2.1s"
            color="amber"
            mono
          />
          <QuickMetric
            icon={<Zap size={14} />}
            label="Cost MTD"
            value={`$${COST_DATA.thisMonth.toFixed(2)}`}
            color="rose"
            mono
          />
        </div>
      </div>
    </motion.div>
  );
}

function QuickMetric({
  icon,
  label,
  value,
  color,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  mono?: boolean;
}) {
  const colorMap: Record<string, string> = {
    cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/[0.08]",
    violet: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/[0.08]",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/[0.08]",
    rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/[0.08]",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/[0.08]",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/[0.08]",
  };

  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-white/[0.04] dark:bg-white/[0.02]">
      <div className={`mb-1.5 flex h-6 w-6 items-center justify-center rounded-md ${colorMap[color]}`}>
        {icon}
      </div>
      <p className={`text-sm font-bold text-zinc-900 dark:text-zinc-100 ${mono ? "font-data" : ""}`}>
        {value}
      </p>
      <p className="text-[10px] text-zinc-500">{label}</p>
    </div>
  );
}
