"use client";

import { cn } from "@/lib/utils";

interface StatusPulseProps {
  status: "online" | "degraded" | "offline" | "active" | "idle" | "error" | "cooldown";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusColors: Record<string, string> = {
  online: "bg-emerald-500",
  active: "bg-emerald-500",
  degraded: "bg-amber-500",
  idle: "bg-zinc-400 dark:bg-zinc-500",
  offline: "bg-red-500",
  error: "bg-red-500",
  cooldown: "bg-amber-500",
};

const pulseColors: Record<string, string> = {
  online: "bg-emerald-400",
  active: "bg-emerald-400",
  degraded: "bg-amber-400",
  idle: "",
  offline: "bg-red-400",
  error: "bg-red-400",
  cooldown: "bg-amber-400",
};

const sizes = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export function StatusPulse({
  status,
  size = "md",
  className,
}: StatusPulseProps) {
  const shouldPulse = status === "online" || status === "active";

  return (
    <span className={cn("relative inline-flex", className)}>
      {shouldPulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            pulseColors[status]
          )}
        />
      )}
      <span
        className={cn("relative inline-flex rounded-full", sizes[size], statusColors[status])}
      />
    </span>
  );
}
