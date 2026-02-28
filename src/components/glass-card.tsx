"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  delay = 0,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      className={cn(
        "rounded-2xl border border-zinc-200/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-shadow",
        "dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-2xl",
        hover && "hover:shadow-md dark:hover:border-white/[0.12] dark:hover:shadow-cyan-500/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
