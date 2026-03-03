"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  size = "sm",
  disabled = false,
  className,
}: ToggleSwitchProps) {
  const isSmall = size === "sm";

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
        isSmall ? "h-5 w-9" : "h-6 w-11",
        checked
          ? "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          : "bg-zinc-300 dark:bg-zinc-700",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "inline-block rounded-full bg-white shadow-sm",
          isSmall ? "h-3.5 w-3.5" : "h-4.5 w-4.5",
          checked
            ? isSmall ? "translate-x-[18px]" : "translate-x-[22px]"
            : "translate-x-[3px]"
        )}
      />
    </button>
  );
}
