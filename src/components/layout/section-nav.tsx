"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Cpu,
  Blocks,
  Settings2,
  Terminal,
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
  { id: "console", label: "Console", icon: <Terminal size={16} /> },
];

export function SectionNav({ active, onChange }: SectionNavProps) {
  return (
    <nav className="sticky top-[57px] z-40 -mx-4 mb-6 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 dark:border-white/[0.04] dark:bg-[#06080f]/60">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto py-1 scrollbar-none">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onChange(section.id)}
            className={cn(
              "relative flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              active === section.id
                ? "text-cyan-600 dark:text-cyan-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            )}
          >
            {section.icon}
            <span className="hidden sm:inline">{section.label}</span>
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
