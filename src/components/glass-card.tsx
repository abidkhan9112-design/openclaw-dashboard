"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type NeonColor = "cyan" | "violet" | "emerald" | "rose" | "amber" | "blue";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  glow?: NeonColor;
  neonBorder?: boolean;
}

const glowMap: Record<NeonColor, string> = {
  cyan: "hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] dark:hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]",
  violet: "hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]",
  emerald: "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]",
  rose: "hover:shadow-[0_0_20px_rgba(251,113,133,0.15)] dark:hover:shadow-[0_0_25px_rgba(251,113,133,0.2)]",
  amber: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] dark:hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]",
  blue: "hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]",
};

const neonBorderMap: Record<NeonColor, string> = {
  cyan: "hover:border-cyan-400/30 dark:hover:border-cyan-400/20",
  violet: "hover:border-violet-400/30 dark:hover:border-violet-400/20",
  emerald: "hover:border-emerald-400/30 dark:hover:border-emerald-400/20",
  rose: "hover:border-rose-400/30 dark:hover:border-rose-400/20",
  amber: "hover:border-amber-400/30 dark:hover:border-amber-400/20",
  blue: "hover:border-blue-400/30 dark:hover:border-blue-400/20",
};

export function GlassCard({
  children,
  className,
  delay = 0,
  hover = true,
  glow,
  neonBorder = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hover ? { scale: 1.008, y: -2 } : undefined}
      className={cn(
        "rounded-2xl border border-zinc-200/60 bg-white/70 p-5 backdrop-blur-xl transition-all duration-300",
        "dark:border-white/[0.06] dark:bg-[rgba(15,23,42,0.5)]",
        hover && !glow && "hover:shadow-md dark:hover:border-white/[0.1] dark:hover:shadow-cyan-500/5",
        glow && glowMap[glow],
        glow && neonBorder && neonBorderMap[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
