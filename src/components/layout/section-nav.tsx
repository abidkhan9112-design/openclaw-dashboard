"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Cpu,
  Blocks,
  Settings2,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionId = "overview" | "models" | "skills" | "operations" | "console";

interface SectionNavProps {
  active: SectionId;
  onChange: (id: SectionId) => void;
}

const sections: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { id: "models", label: "Models", icon: <Cpu size={16} /> },
  { id: "skills", label: "Skills", icon: <Blocks size={16} /> },
  { id: "operations", label: "Ops", icon: <Settings2 size={16} /> },
  { id: "console", label: "Chat", icon: <MessageCircle size={16} /> },
];

export function SectionNav({ active, onChange }: SectionNavProps) {
  return (
    <nav className="sticky top-[57px] z-40 mb-4 border-b border-zinc-200 bg-white px-2 sm:mb-6 sm:px-4 lg:px-8 dark:border-white/[0.04] dark:bg-[#06080f]/90 dark:backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-0.5 overflow-x-auto py-1 scrollbar-none sm:justify-start sm:gap-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onChange(section.id)}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-0.5 whitespace-nowrap rounded-lg px-2 py-2 text-[10px] font-medium transition-colors sm:flex-none sm:flex-row sm:gap-2 sm:px-3 sm:text-xs",
              active === section.id
                ? "text-cyan-600 dark:text-cyan-400"
                : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            )}
          >
            {section.icon}
            <span>{section.label}</span>
            {active === section.id && (
              <motion.div
                layoutId="section-indicator"
                className="absolute inset-x-1 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
