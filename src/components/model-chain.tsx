"use client";

import { motion } from "framer-motion";
import {
  ChevronRight,
  Cpu,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { StatusPulse } from "./status-pulse";
import { MODELS, type AIModel } from "@/lib/openclaw-data";

const roleIcons = {
  primary: Cpu,
  fallback: Shield,
  subagent: Users,
};

const roleBadgeStyles = {
  primary:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
  fallback:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  subagent:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

export function ModelChain() {
  const primary = MODELS.filter((m) => m.role === "primary");
  const fallbacks = MODELS.filter((m) => m.role === "fallback");
  const subagents = MODELS.filter((m) => m.role === "subagent");

  return (
    <GlassCard delay={0.3} className="col-span-full">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              AI Model Chain
            </h2>
            <p className="text-xs text-zinc-500">
              Avalanche fallback routing · {MODELS.length} models active
            </p>
          </div>
        </div>
      </div>

      {/* Visual chain */}
      <div className="flex flex-wrap items-center gap-2">
        {MODELS.sort((a, b) => a.priority - b.priority).map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center gap-2"
          >
            <ModelPill model={model} />
            {i < MODELS.length - 1 && (
              <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-600" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Model details grid */}
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {MODELS.map((model, i) => (
          <ModelDetail key={model.id} model={model} index={i} />
        ))}
      </div>
    </GlassCard>
  );
}

function ModelPill({ model }: { model: AIModel }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5",
        "border-zinc-200/60 bg-zinc-50 dark:border-white/[0.08] dark:bg-white/[0.04]",
        model.role === "primary" &&
          "border-cyan-200 bg-cyan-50 dark:border-cyan-500/20 dark:bg-cyan-500/[0.08]"
      )}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: model.color }}
      />
      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {model.name}
      </span>
      <StatusPulse status={model.status === "active" ? "online" : "idle"} size="sm" />
    </div>
  );
}

function ModelDetail({ model, index }: { model: AIModel; index: number }) {
  const RoleIcon = roleIcons[model.role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.05 }}
      className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-white/[0.05] dark:bg-white/[0.02]"
    >
      <div className="flex items-center gap-2.5">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${model.color}15` }}
        >
          <RoleIcon size={14} style={{ color: model.color }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {model.name}
          </p>
          <p className="text-[10px] text-zinc-500">{model.provider}</p>
        </div>
      </div>
      <div className="text-right">
        <span
          className={cn(
            "inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase",
            roleBadgeStyles[model.role]
          )}
        >
          {model.role}
        </span>
        <p className="mt-0.5 text-[10px] text-zinc-400">
          {model.avgLatencyMs > 0 ? `${(model.avgLatencyMs / 1000).toFixed(1)}s` : "—"}
        </p>
      </div>
    </motion.div>
  );
}
