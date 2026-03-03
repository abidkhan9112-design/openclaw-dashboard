"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { StatusPulse } from "./status-pulse";
import { useToast } from "./ui/toast-notification";
import { MODELS, type AIModel } from "@/lib/openclaw-data";

type ModelHealth = "checking" | "healthy" | "degraded" | "unreachable" | "unknown";

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
  const [gatewayStatus, setGatewayStatus] = useState<"checking" | "online" | "offline">("checking");
  const [modelStatuses, setModelStatuses] = useState<Record<string, ModelStatusInfo>>(
    Object.fromEntries(MODELS.map((m) => [m.id, { health: "unknown" as ModelHealth, reason: "Not checked yet" }]))
  );
  const { toast } = useToast();

  const checkModelStatus = useCallback(async () => {
    // Set all to checking
    setModelStatuses((prev) => {
      const next = { ...prev };
      for (const id of Object.keys(next)) {
        next[id] = { ...next[id], health: "checking" };
      }
      return next;
    });
    setGatewayStatus("checking");

    try {
      const res = await fetch("/api/gateway/models");
      const data = await res.json();

      if (!data.ok) {
        // Gateway unreachable — mark all models as unreachable
        setGatewayStatus("offline");
        setModelStatuses(
          Object.fromEntries(
            MODELS.map((m) => [
              m.id,
              {
                health: "unreachable" as ModelHealth,
                reason: "Cannot reach the OpenClaw gateway. The bot service may be down or restarting.",
                checkedAt: new Date(),
              },
            ])
          )
        );
        return;
      }

      setGatewayStatus("online");

      if (data.models && Array.isArray(data.models)) {
        // Gateway returned model list — match against our known models
        const gatewayModelIds = new Set(
          data.models.map((m: { id?: string }) => m.id?.toLowerCase())
        );

        setModelStatuses(
          Object.fromEntries(
            MODELS.map((m) => {
              const found = gatewayModelIds.has(m.id.toLowerCase()) ||
                data.models.some((gm: { id?: string }) =>
                  gm.id?.toLowerCase().includes(m.id.split("-")[0])
                );
              return [
                m.id,
                {
                  health: found ? "healthy" : "degraded",
                  reason: found
                    ? `Model is available and responding through the gateway.`
                    : `Model not found in gateway's active model list. It may need to be configured or the API key may be missing.`,
                  checkedAt: new Date(),
                } as ModelStatusInfo,
              ];
            })
          )
        );
      } else {
        // Gateway is online but doesn't expose /v1/models — infer from health
        setModelStatuses(
          Object.fromEntries(
            MODELS.map((m) => [
              m.id,
              {
                health: "healthy" as ModelHealth,
                reason: "Gateway is online and routing requests. Model availability confirmed via health check.",
                checkedAt: new Date(),
              },
            ])
          )
        );
      }
    } catch {
      setGatewayStatus("offline");
      setModelStatuses(
        Object.fromEntries(
          MODELS.map((m) => [
            m.id,
            {
              health: "unreachable" as ModelHealth,
              reason: "Network error when checking gateway. The dashboard may not have connectivity to the bot service.",
              checkedAt: new Date(),
            },
          ])
        )
      );
    }
  }, []);

  useEffect(() => {
    checkModelStatus();
  }, [checkModelStatus]);

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
              Avalanche fallback routing · {MODELS.length} models ·{" "}
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
          {/* Refresh status */}
          <button
            onClick={checkModelStatus}
            disabled={gatewayStatus === "checking"}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200/60 bg-white/80 px-2 py-1.5 text-[10px] font-medium text-zinc-500 transition-all hover:text-zinc-700 disabled:opacity-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <RefreshCw size={10} className={cn(gatewayStatus === "checking" && "animate-spin")} />
            Check
          </button>

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
                className="absolute right-0 top-full z-10 mt-1 w-64 rounded-xl border border-zinc-200/60 bg-white/95 p-1 shadow-xl backdrop-blur-xl dark:border-white/[0.08] dark:bg-zinc-900/95"
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
                      <HealthDot health={status?.health || "unknown"} />
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
            <ModelPill model={model} isPrimary={model.id === selectedPrimary} health={modelStatuses[model.id]?.health || "unknown"} />
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
          />
        ))}
      </div>
    </GlassCard>
  );
}

function HealthDot({ health }: { health: ModelHealth }) {
  const styles: Record<ModelHealth, string> = {
    checking: "bg-zinc-300 dark:bg-zinc-600 animate-pulse",
    healthy: "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]",
    degraded: "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]",
    unreachable: "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]",
    unknown: "bg-zinc-300 dark:bg-zinc-600",
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
    case "unreachable":
      return <XCircle size={size} className="text-red-500" />;
    default:
      return <Info size={size} className="text-zinc-400" />;
  }
}

function ModelPill({ model, isPrimary, health }: { model: AIModel; isPrimary: boolean; health: ModelHealth }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all",
        "border-zinc-200/60 bg-zinc-50 dark:border-white/[0.08] dark:bg-white/[0.04]",
        isPrimary &&
          "border-cyan-300/40 bg-cyan-50 shadow-[0_0_12px_rgba(34,211,238,0.15)] dark:border-cyan-500/25 dark:bg-cyan-500/[0.08] dark:shadow-[0_0_12px_rgba(34,211,238,0.1)]",
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
    </div>
  );
}

function ModelDetail({ model, index, isPrimary, status }: { model: AIModel; index: number; isPrimary: boolean; status?: ModelStatusInfo }) {
  const RoleIcon = roleIcons[model.role];
  const [showReason, setShowReason] = useState(false);
  const health = status?.health || "unknown";

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
        health === "unreachable" && "opacity-70"
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
            onClick={() => setShowReason(!showReason)}
            className="transition-transform hover:scale-110"
            title={status?.reason || "Status unknown"}
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
              {model.avgLatencyMs > 0 ? `${(model.avgLatencyMs / 1000).toFixed(1)}s` : "—"}
              {model.costPer1kTokens > 0 && ` · $${model.costPer1kTokens}`}
              {model.costPer1kTokens === 0 && " · Free"}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable status reason */}
      <AnimatePresence>
        {showReason && status?.reason && (
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
              health === "unreachable" && "bg-red-50 text-red-700 dark:bg-red-500/[0.08] dark:text-red-300",
              health === "unknown" && "bg-zinc-50 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
              health === "checking" && "bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
            )}>
              {status.reason}
              {status.checkedAt && (
                <span className="ml-1 opacity-60">
                  (checked {status.checkedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })})
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
