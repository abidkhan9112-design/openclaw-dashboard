"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Cpu,
  Shield,
  Users,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Info,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { useToast } from "./ui/toast-notification";
import { useGatewayStatus } from "@/lib/use-gateway-status";
import { MODELS, type AIModel } from "@/lib/openclaw-data";

type ModelHealth = "unchecked" | "checking" | "healthy" | "degraded" | "error" | "unreachable";

interface ModelStatusInfo {
  health: ModelHealth;
  reason: string;
  latencyMs?: number;
  checkedAt?: Date;
}

const roleIcons = {
  primary: Cpu,
  fallback: Shield,
  subagent: Users,
};

const roleBadgeStyles = {
  primary: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
  fallback: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  subagent: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

export function ModelChain() {
  const [selectedPrimary, setSelectedPrimary] = useState(
    MODELS.find((m) => m.role === "primary")?.id || MODELS[0].id
  );
  const [showSelector, setShowSelector] = useState(false);
  const { online: gatewayOnline } = useGatewayStatus();
  const { toast } = useToast();

  const [modelStatuses, setModelStatuses] = useState<Record<string, ModelStatusInfo>>(
    Object.fromEntries(MODELS.map((m) => [m.id, { health: "unchecked" as ModelHealth, reason: "Click the status icon to test this model" }]))
  );

  // Check a single model
  const checkModel = useCallback(async (modelId: string) => {
    setModelStatuses((prev) => ({
      ...prev,
      [modelId]: { health: "checking", reason: "Testing model..." },
    }));

    try {
      const res = await fetch("/api/gateway/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId }),
      });
      const data = await res.json();

      setModelStatuses((prev) => ({
        ...prev,
        [modelId]: {
          health: data.ok ? "healthy" : (data.status === "degraded" ? "degraded" : "error"),
          reason: data.reason || "Unknown status",
          latencyMs: data.latencyMs,
          checkedAt: new Date(),
        },
      }));
    } catch {
      setModelStatuses((prev) => ({
        ...prev,
        [modelId]: {
          health: "unreachable",
          reason: "Could not reach the gateway to test this model.",
          checkedAt: new Date(),
        },
      }));
    }
  }, []);

  // Check all models
  const checkAllModels = useCallback(async () => {
    for (const model of MODELS) {
      // Don't await — fire them in sequence with small delays to avoid overloading
      checkModel(model.id);
      await new Promise((r) => setTimeout(r, 500));
    }
  }, [checkModel]);

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

  const gatewayStatus = gatewayOnline === null ? "checking" : gatewayOnline ? "online" : "offline";
  const anyChecking = Object.values(modelStatuses).some((s) => s.health === "checking");

  return (
    <GlassCard delay={0.2} glow="cyan" className="col-span-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              AI Model Chain
            </h2>
            <p className="text-xs text-zinc-500">
              {MODELS.length} models ·{" "}
              <span className={cn(
                "font-semibold",
                gatewayStatus === "online" && "text-emerald-600 dark:text-emerald-400",
                gatewayStatus === "offline" && "text-red-500",
                gatewayStatus === "checking" && "text-zinc-400",
              )}>
                Gateway {gatewayStatus}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Test all models button */}
          <button
            onClick={checkAllModels}
            disabled={anyChecking || !gatewayOnline}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200/60 bg-white px-2.5 py-1.5 text-[10px] font-medium text-zinc-600 transition-all hover:border-cyan-300/40 hover:text-cyan-600 disabled:opacity-40 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:border-cyan-500/20 dark:hover:text-cyan-400"
          >
            <Zap size={10} className={cn(anyChecking && "animate-spin")} />
            Test All
          </button>

          {/* Primary model selector */}
          <div className="relative">
            <button
              onClick={() => setShowSelector(!showSelector)}
              className="flex items-center gap-2 rounded-lg border border-zinc-200/60 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:border-cyan-300/40 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-cyan-500/20"
            >
              <span className="text-[10px] text-zinc-500 hidden sm:inline">Primary:</span>
              <span className="font-data">{MODELS.find((m) => m.id === selectedPrimary)?.name}</span>
              <ChevronDown size={12} className={cn("transition-transform", showSelector && "rotate-180")} />
            </button>

            {showSelector && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-full z-10 mt-1 w-64 rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-white/[0.08] dark:bg-zinc-900/95"
              >
                {MODELS.map((model) => {
                  const status = modelStatuses[model.id];
                  return (
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
                      <HealthDot health={status?.health || "unchecked"} />
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
                  );
                })}
              </motion.div>
            )}
          </div>
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
            <ModelPill
              model={model}
              isPrimary={model.id === selectedPrimary}
              health={modelStatuses[model.id]?.health || "unchecked"}
              onCheck={() => checkModel(model.id)}
            />
            {i < sortedModels.length - 1 && (
              <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-600" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Model details grid */}
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sortedModels.map((model, i) => (
          <ModelDetail
            key={model.id}
            model={model}
            index={i}
            isPrimary={model.id === selectedPrimary}
            status={modelStatuses[model.id]}
            onCheck={() => checkModel(model.id)}
          />
        ))}
      </div>
    </GlassCard>
  );
}

function HealthDot({ health }: { health: ModelHealth }) {
  const styles: Record<ModelHealth, string> = {
    unchecked: "bg-zinc-300 dark:bg-zinc-600",
    checking: "bg-zinc-300 dark:bg-zinc-600 animate-pulse",
    healthy: "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]",
    degraded: "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]",
    error: "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]",
    unreachable: "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]",
  };

  return <div className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", styles[health])} />;
}

function HealthIcon({ health, size = 14 }: { health: ModelHealth; size?: number }) {
  switch (health) {
    case "checking":
      return <Loader2 size={size} className="animate-spin text-zinc-400" />;
    case "healthy":
      return <CheckCircle2 size={size} className="text-emerald-500" />;
    case "degraded":
      return <AlertTriangle size={size} className="text-amber-500" />;
    case "error":
    case "unreachable":
      return <XCircle size={size} className="text-red-500" />;
    default:
      return <Info size={size} className="text-zinc-400" />;
  }
}

function ModelPill({
  model,
  isPrimary,
  health,
  onCheck,
}: {
  model: AIModel;
  isPrimary: boolean;
  health: ModelHealth;
  onCheck: () => void;
}) {
  return (
    <button
      onClick={onCheck}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all",
        "border-zinc-200/60 bg-zinc-50 hover:bg-zinc-100 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.06]",
        isPrimary &&
          "border-cyan-300/40 bg-cyan-50 shadow-[0_0_12px_rgba(34,211,238,0.15)] hover:bg-cyan-100/50 dark:border-cyan-500/25 dark:bg-cyan-500/[0.08] dark:shadow-[0_0_12px_rgba(34,211,238,0.1)]",
        health === "error" && "opacity-60",
        health === "unreachable" && "opacity-60"
      )}
    >
      <HealthDot health={health} />
      <span className="text-xs font-medium text-zinc-700 font-data dark:text-zinc-300">
        {model.name}
      </span>
      {isPrimary && (
        <span className="rounded px-1 py-0.5 text-[8px] font-bold uppercase text-cyan-600 bg-cyan-100/60 dark:bg-cyan-500/10 dark:text-cyan-400">
          PRIMARY
        </span>
      )}
    </button>
  );
}

function ModelDetail({
  model,
  index,
  isPrimary,
  status,
  onCheck,
}: {
  model: AIModel;
  index: number;
  isPrimary: boolean;
  status?: ModelStatusInfo;
  onCheck: () => void;
}) {
  const RoleIcon = roleIcons[model.role];
  const [showReason, setShowReason] = useState(false);
  const health = status?.health || "unchecked";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.05 }}
      className={cn(
        "relative flex flex-col rounded-xl border p-3 transition-all",
        isPrimary
          ? "border-cyan-200/40 bg-cyan-50/30 dark:border-cyan-500/15 dark:bg-cyan-500/[0.04]"
          : "border-zinc-100 bg-zinc-50/50 dark:border-white/[0.05] dark:bg-white/[0.02]",
        (health === "error" || health === "unreachable") && "opacity-70"
      )}
    >
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => { onCheck(); setShowReason(true); }}
            className="transition-transform hover:scale-110"
            title={health === "unchecked" ? "Click to test model" : (status?.reason || "Status unknown")}
          >
            <HealthIcon health={health} />
          </button>
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
              {status?.latencyMs ? `${(status.latencyMs / 1000).toFixed(1)}s` : (model.avgLatencyMs > 0 ? `~${(model.avgLatencyMs / 1000).toFixed(1)}s` : "—")}
              {model.costPer1kTokens > 0 && ` · $${model.costPer1kTokens}`}
              {model.costPer1kTokens === 0 && " · Free"}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable status reason */}
      <AnimatePresence>
        {showReason && status && status.health !== "unchecked" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={cn(
              "mt-2 rounded-lg px-3 py-2 text-[11px] leading-relaxed",
              health === "healthy" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/[0.08] dark:text-emerald-300",
              health === "degraded" && "bg-amber-50 text-amber-700 dark:bg-amber-500/[0.08] dark:text-amber-300",
              (health === "error" || health === "unreachable") && "bg-red-50 text-red-700 dark:bg-red-500/[0.08] dark:text-red-300",
              health === "checking" && "bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
            )}>
              {status.reason}
              {status.checkedAt && (
                <span className="ml-1 opacity-60">
                  ({status.checkedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })})
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
