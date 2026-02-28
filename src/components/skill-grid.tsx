"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Hash,
  Globe,
  TrendingUp,
  BarChart2,
  Activity,
  PieChart,
  Compass,
  Zap,
  AtSign,
  Database,
  Brain,
  Users,
  Blocks,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { StatusPulse } from "./status-pulse";
import { SKILLS, type Skill, type SkillCategory } from "@/lib/openclaw-data";

const iconMap: Record<string, React.ReactNode> = {
  mail: <Mail size={18} />,
  hash: <Hash size={18} />,
  globe: <Globe size={18} />,
  "trending-up": <TrendingUp size={18} />,
  "bar-chart-2": <BarChart2 size={18} />,
  activity: <Activity size={18} />,
  "pie-chart": <PieChart size={18} />,
  compass: <Compass size={18} />,
  zap: <Zap size={18} />,
  "at-sign": <AtSign size={18} />,
  database: <Database size={18} />,
  brain: <Brain size={18} />,
  users: <Users size={18} />,
};

const categoryColors: Record<SkillCategory, string> = {
  productivity: "#3b82f6",
  trading: "#10b981",
  content: "#f59e0b",
  system: "#8b5cf6",
};

const categoryLabels: Record<SkillCategory, string> = {
  productivity: "Productivity",
  trading: "Trading",
  content: "Content & API",
  system: "System",
};

const filters: (SkillCategory | "all")[] = [
  "all",
  "productivity",
  "trading",
  "content",
  "system",
];

export function SkillGrid() {
  const [activeFilter, setActiveFilter] = useState<SkillCategory | "all">(
    "all"
  );

  const filtered =
    activeFilter === "all"
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeFilter);

  const totalUsage = SKILLS.reduce((sum, s) => sum + s.usageLast24h, 0);
  const activeCount = SKILLS.filter((s) => s.status === "active").length;

  return (
    <GlassCard delay={0.4} className="col-span-full">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
            <Blocks size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Skills & Plugins
            </h2>
            <p className="text-xs text-zinc-500">
              {activeCount} active · {totalUsage} invocations (24h)
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-zinc-400" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all",
                activeFilter === f
                  ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
              )}
            >
              {f === "all" ? "All" : categoryLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Skill tiles */}
      <motion.div layout className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((skill) => (
            <SkillTile key={skill.id} skill={skill} />
          ))}
        </AnimatePresence>
      </motion.div>
    </GlassCard>
  );
}

function SkillTile({ skill }: { skill: Skill }) {
  const color = categoryColors[skill.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.03, y: -2 }}
      className={cn(
        "group relative cursor-default rounded-xl border p-3 transition-colors",
        "border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/80",
        "dark:border-white/[0.05] dark:bg-white/[0.02] dark:hover:bg-white/[0.06]"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color }}>{iconMap[skill.icon] || <Zap size={18} />}</span>
        </div>
        <StatusPulse status={skill.status} size="sm" />
      </div>
      <h3 className="mt-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
        {skill.name}
      </h3>
      <p className="mt-0.5 text-[10px] leading-tight text-zinc-500">
        {skill.description}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {skill.category}
        </span>
        <span className="text-[10px] font-medium text-zinc-400">
          {skill.usageLast24h} calls
        </span>
      </div>
    </motion.div>
  );
}
