"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Primary cyan orb — top left */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-cyan-500/8 blur-[140px] dark:bg-cyan-500/[0.06]"
      />

      {/* Violet orb — bottom right */}
      <motion.div
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-500/8 blur-[140px] dark:bg-violet-500/[0.06]"
      />

      {/* Emerald orb — center, subtle */}
      <motion.div
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -25, 35, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/4 blur-[120px] dark:bg-emerald-500/[0.03]"
      />

      {/* Rose accent orb — right side */}
      <motion.div
        animate={{
          x: [0, -20, 15, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8,
        }}
        className="absolute right-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-rose-500/3 blur-[100px] dark:bg-rose-500/[0.02]"
      />
    </div>
  );
}
