"use client";

import { motion } from "framer-motion";
import { Bot, Zap } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { StatusPulse } from "./status-pulse";
import { GATEWAY } from "@/lib/openclaw-data";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-zinc-200/50 bg-white/60 backdrop-blur-xl dark:border-white/[0.06] dark:bg-zinc-950/60"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left — Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20">
            <Bot size={22} className="text-white" />
            <div className="absolute -bottom-0.5 -right-0.5">
              <StatusPulse status="online" size="sm" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              OpenClaw{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                Mission Control
              </span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              3 channels · 13 skills · {GATEWAY.uptime}% uptime
            </p>
          </div>
        </div>

        {/* Right — Status & Theme Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-zinc-200/60 bg-zinc-50/80 px-3 py-1.5 dark:border-white/[0.08] dark:bg-white/[0.04] sm:flex">
            <Zap size={12} className="text-emerald-500" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
