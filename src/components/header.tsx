"use client";

import { motion } from "framer-motion";
import { Bot, Zap } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { StatusPulse } from "./status-pulse";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-xl dark:border-white/[0.04] dark:bg-[#06080f]/60"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left — Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20">
            <Bot size={22} className="text-white" />
            <div className="absolute -bottom-0.5 -right-0.5">
              <StatusPulse status="online" size="sm" glow />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              OpenClaw{" "}
              <span className="neon-text-gradient">
                Mission Control
              </span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-data">
              3 channels · 13 skills · 99.7% uptime
            </p>
          </div>
        </div>

        {/* Right — Status & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200/40 bg-emerald-50/60 px-3 py-1.5 sm:flex dark:border-emerald-500/15 dark:bg-emerald-500/[0.06]">
            <Zap size={12} className="text-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              Gateway Live
            </span>
            <StatusPulse status="online" size="sm" />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
