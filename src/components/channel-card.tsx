"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Hash,
  Phone,
  ArrowUpRight,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { StatusPulse } from "./status-pulse";
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

const platformBgLight = {
  telegram: "bg-sky-50",
  slack: "bg-purple-50",
  whatsapp: "bg-green-50",
};

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

export function ChannelCard({ channel, index }: ChannelCardProps) {
  const Icon = platformIcons[channel.platform];
  const gradient = platformGradients[channel.platform];

  return (
    <GlassCard delay={0.1 + index * 0.08}>
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
              <StatusPulse status={channel.status} size="sm" />
            </div>
            <p className="text-xs text-zinc-500">{channel.handle}</p>
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
          platform={channel.platform}
        />
        <Stat
          icon={<Zap size={12} />}
          label="Avg Response"
          value={
            channel.avgResponseMs > 0
              ? `${(channel.avgResponseMs / 1000).toFixed(1)}s`
              : "—"
          }
          platform={channel.platform}
        />
        <Stat
          icon={<Clock size={12} />}
          label="Last Active"
          value={channel.lastActive}
          platform={channel.platform}
        />
      </div>

      {/* Config badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge>{channel.policy}</Badge>
        <Badge>{channel.streamMode}</Badge>
      </div>
    </GlassCard>
  );
}

function Stat({
  icon,
  label,
  value,
  platform,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  platform: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-2",
        platformBgLight[platform as keyof typeof platformBgLight],
        "dark:bg-white/[0.03]"
      )}
    >
      <div className="flex items-center gap-1 text-zinc-400">{icon}</div>
      <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      <p className="text-[10px] text-zinc-500">{label}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-zinc-200/60 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-zinc-400">
      {children}
    </span>
  );
}
