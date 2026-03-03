"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshIndicatorProps {
  lastUpdated: Date | null;
  refreshing: boolean;
  onRefresh: () => void;
  className?: string;
}

export function RefreshIndicator({
  lastUpdated,
  refreshing,
  onRefresh,
  className,
}: RefreshIndicatorProps) {
  const timeAgo = lastUpdated ? getSecondsAgo(lastUpdated) : null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {timeAgo !== null && (
        <span className="text-[10px] text-zinc-400 font-data">
          {timeAgo < 5 ? "just now" : `${timeAgo}s ago`}
        </span>
      )}
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200/60 bg-white/80 transition-all hover:bg-zinc-50",
          "dark:border-white/[0.06] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]",
          refreshing && "animate-spin"
        )}
        title="Refresh data"
      >
        <RefreshCw size={13} className="text-zinc-500" />
      </button>
    </div>
  );
}

function getSecondsAgo(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / 1000);
}
