"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Hash,
  Phone,
  ArrowUpRight,
  Clock,
  Zap,
  Send,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { StatusPulse } from "./status-pulse";
import { useToast } from "./ui/toast-notification";
import type { Channel } from "@/lib/openclaw-data";

const platformIcons = {
  telegram: MessageCircle,
  slack: Hash,
  whatsapp: Phone,
};

const platformGradients = {
  telegram: "from-sky-500 to-blue-600",
  slack: "from-purple-500 to-fuchsia-600",
  whatsapp: "from-green-500 to-emerald-600",
};

const platformGlow: Record<string, "cyan" | "violet" | "emerald"> = {
  telegram: "cyan",
  slack: "violet",
  whatsapp: "emerald",
};

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

export function ChannelCard({ channel, index }: ChannelCardProps) {
  const Icon = platformIcons[channel.platform];
  const gradient = platformGradients[channel.platform];
  const glow = platformGlow[channel.platform];
  const [testInput, setTestInput] = useState("");
  const [showTest, setShowTest] = useState(false);
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  async function handleSendTest() {
    if (!testInput.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/gateway/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testInput, channel: channel.id }),
      });
      if (res.ok) {
        toast(`Test message sent to ${channel.name}`, "success");
        setTestInput("");
        setShowTest(false);
      } else {
        toast(`Failed to send: gateway returned ${res.status}`, "error");
      }
    } catch {
      toast("Gateway unreachable", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <GlassCard delay={0.1 + index * 0.08} glow={glow}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
              gradient,
              channel.platform === "telegram" && "shadow-sky-500/25",
              channel.platform === "slack" && "shadow-purple-500/25",
              channel.platform === "whatsapp" && "shadow-green-500/25"
            )}
          >
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {channel.name}
              </h3>
              <StatusPulse status={channel.status} size="sm" glow />
            </div>
            <p className="text-xs text-zinc-500 font-data">{channel.handle}</p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            channel.status === "online" &&
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
            channel.status === "degraded" &&
              "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
            channel.status === "offline" &&
              "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
          )}
        >
          {channel.status}
        </span>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat
          icon={<ArrowUpRight size={12} />}
          label="Messages 24h"
          value={channel.messagesLast24h.toString()}
        />
        <Stat
          icon={<Zap size={12} />}
          label="Avg Response"
          value={
            channel.avgResponseMs > 0
              ? `${(channel.avgResponseMs / 1000).toFixed(1)}s`
              : "—"
          }
        />
        <Stat
          icon={<Clock size={12} />}
          label="Last Active"
          value={channel.lastActive}
        />
      </div>

      {/* Config badges + actions */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <Badge>{channel.policy}</Badge>
          <Badge>{channel.streamMode}</Badge>
        </div>
        <div className="flex gap-1.5">
          {channel.status === "online" && (
            <button
              onClick={() => setShowTest(!showTest)}
              className="rounded-md border border-zinc-200/60 bg-white/80 px-2 py-1 text-[10px] font-medium text-zinc-600 transition-all hover:border-cyan-300/40 hover:text-cyan-600 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:border-cyan-500/20 dark:hover:text-cyan-400"
            >
              Test
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-md border border-zinc-200/60 bg-white/80 p-1 text-zinc-400 transition-all hover:text-zinc-600 dark:border-white/[0.06] dark:bg-white/[0.04] dark:hover:text-zinc-300"
          >
            <ChevronDown size={12} className={cn("transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Test message input */}
      <AnimatePresence>
        {showTest && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendTest()}
                placeholder="Test message..."
                className="flex-1 rounded-lg border border-zinc-200/60 bg-white/80 px-3 py-1.5 text-xs outline-none transition-all placeholder:text-zinc-400 focus:border-cyan-400/40 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-zinc-300"
              />
              <button
                onClick={handleSendTest}
                disabled={!testInput.trim() || sending}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 text-white transition-all hover:scale-105 disabled:opacity-40"
              >
                {sending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded config */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 space-y-1.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
              <ConfigRow label="Policy" value={channel.policy} />
              <ConfigRow label="Stream Mode" value={channel.streamMode} />
              <ConfigRow label="Platform" value={channel.platform} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-50 p-2 dark:bg-white/[0.03]">
      <div className="flex items-center gap-1 text-zinc-400">{icon}</div>
      <p className="mt-1 text-sm font-bold text-zinc-900 font-data dark:text-zinc-100">
        {value}
      </p>
      <p className="text-[10px] text-zinc-500">{label}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-zinc-200/60 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500 font-data dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-zinc-400">
      {children}
    </span>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-zinc-500">{label}</span>
      <span className="text-[10px] font-semibold text-zinc-700 font-data dark:text-zinc-300">{value}</span>
    </div>
  );
}
