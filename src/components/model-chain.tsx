"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Cpu,
  Shield,
  Users,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { StatusPulse } from "./status-pulse";
import { useToast } from "./ui/toast-notification";
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
  const [selectedPrimary, setSelectedPrimary] = useState(
    MODELS.find((m) => m.role === "primary")?.id || MODELS[0].id
  );
  const [showSelector, setShowSelector] = useState(false);
  const { toast } = useToast();

  function handleModelChange(modelId: string) {
    setSelectedPrimary(modelId);
    setShowSelector(false);
    const model = MODELS.find((m) => m.id === modelId);
    toast(`Primary model changed to ${model?.name}`, "success");
  }

  const sortedModels = [...MODELS].sort((a, b) => {
    if (a.id === selectedPrimary) return -1;
    if (b.id === selectedPrimary) return 1;
    return a.priority - b.priority;
  });

  return (
    <GlassCard delay={0.2} glow="cyan" className="col-span-full">
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

        {/* Primary model selector */}
        <div className="relative">
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="flex items-center gap-2 rounded-lg border border-zinc-200/60 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:border-cyan-300/40 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-cyan-500/20"
          >
            <span className="text-[10px] text-zinc-500">Primary:</span>
            <span className="font-data">{MODELS.find((m) => m.id === selectedPrimary)?.name}</span>
            <ChevronDown size={12} className={cn("transition-transform", showSelector && "rotate-180")} />
          </button>

          {showSelector && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-full z-10 mt-1 w-56 rounded-xl border border-zinc-200/60 bg-white/95 p-1 shadow-xl backdrop-blur-xl dark:border-white/[0.08] dark:bg-zinc-900/95"
            >
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelChange(model.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors",
                    model.id === selectedPrimary
                      ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-white/[0.04]"
                  )}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                  <div className="flex-1">
                    <span className="font-medium">{model.name}</span>
                    <span className="ml-1.5 text-[10px] text-zinc-400">{model.provider}</span>
                  </div>
                  {model.costPer1kTokens === 0 && (
                    <span className="rounded px-1 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400">
                      FREE
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Visual chain */}
      <div className="flex flex-wrap items-center gap-2">
        {sortedModels.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center gap-2"
          >
            <ModelPill model={model} isPrimary={model.id === selectedPrimary} />
            {i < sortedModels.length - 1 && (
              <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-600" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Model details grid */}
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sortedModels.map((model, i) => (
          <ModelDetail key={model.id} model={model} index={i} isPrimary={model.id === selectedPrimary} />
        ))}
      </div>
    </GlassCard>
  );
}

function ModelPill({ model, isPrimary }: { model: AIModel; isPrimary: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all",
        "border-zinc-200/60 bg-zinc-50 dark:border-white/[0.08] dark:bg-white/[0.04]",
        isPrimary &&
          "border-cyan-300/40 bg-cyan-50 shadow-[0_0_12px_rgba(34,211,238,0.15)] dark:border-cyan-500/25 dark:bg-cyan-500/[0.08] dark:shadow-[0_0_12px_rgba(34,211,238,0.1)]"
      )}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: model.color }}
      />
      <span className="text-xs font-medium text-zinc-700 font-data dark:text-zinc-300">
        {model.name}
      </span>
      {isPrimary && (
        <span className="rounded px-1 py-0.5 text-[8px] font-bold uppercase text-cyan-600 bg-cyan-100/60 dark:bg-cyan-500/10 dark:text-cyan-400">
          PRIMARY
        </span>
      )}
      <StatusPulse status={model.status === "active" ? "online" : "idle"} size="sm" />
    </div>
  );
}

function ModelDetail({ model, index, isPrimary }: { model: AIModel; index: number; isPrimary: boolean }) {
  const RoleIcon = roleIcons[model.role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.05 }}
      className={cn(
        "flex items-center justify-between rounded-xl border p-3 transition-all",
        isPrimary
          ? "border-cyan-200/40 bg-cyan-50/30 dark:border-cyan-500/15 dark:bg-cyan-500/[0.04]"
          : "border-zinc-100 bg-zinc-50/50 dark:border-white/[0.05] dark:bg-white/[0.02]"
      )}
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
            isPrimary ? roleBadgeStyles.primary : roleBadgeStyles[model.role]
          )}
        >
          {isPrimary ? "primary" : model.role}
        </span>
        <p className="mt-0.5 text-[10px] text-zinc-400 font-data">
          {model.avgLatencyMs > 0 ? `${(model.avgLatencyMs / 1000).toFixed(1)}s` : "—"}
          {model.costPer1kTokens > 0 && ` · $${model.costPer1kTokens}`}
          {model.costPer1kTokens === 0 && " · Free"}
        </p>
      </div>
    </motion.div>
  );
}
