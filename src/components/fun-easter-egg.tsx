"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#22d3ee", "#a855f7", "#10b981", "#f59e0b", "#fb7185", "#3b82f6"];

export function ConfettiBurst({ trigger }: { trigger: boolean }) {
  return (
    <AnimatePresence>
      {trigger && (
        <div className="pointer-events-none fixed inset-0 z-[100]">
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 30 + Math.random() * 0.5;
            const velocity = 200 + Math.random() * 300;
            const color = COLORS[i % COLORS.length];
            const size = 4 + Math.random() * 6;
            return (
              <motion.div
                key={i}
                initial={{ x: "50vw", y: "50vh", opacity: 1, scale: 1 }}
                animate={{
                  x: `calc(50vw + ${Math.cos(angle) * velocity}px)`,
                  y: `calc(50vh + ${Math.sin(angle) * velocity}px)`,
                  opacity: 0,
                  scale: 0,
                  rotate: Math.random() * 720,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  width: size,
                  height: size,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

const FACTS = [
  "Your bot has processed over 1,200 messages this month",
  "Gemini 3.1 Pro handles 85% of all requests",
  "Your cheapest model costs $0.001/1k tokens",
  "The QMD memory has 1,247 indexed documents",
  "Average response time is under 2.5 seconds",
  "13 skills are loaded and ready to go",
  "Your bot runs 24/7 on Railway with 99.7% uptime",
  "Auto-deploy means git push → live in 3 minutes",
];

export function FunFactBanner() {
  const [factIndex, setFactIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const nextFact = useCallback(() => {
    setFactIndex((i) => (i + 1) % FACTS.length);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
  }, []);

  return (
    <>
      <ConfettiBurst trigger={showConfetti} />
      <motion.button
        onClick={nextFact}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="group w-full rounded-2xl border border-zinc-200/60 bg-gradient-to-r from-cyan-50/50 via-violet-50/50 to-pink-50/50 p-4 text-left transition-all hover:shadow-md dark:border-white/[0.06] dark:from-cyan-500/[0.04] dark:via-violet-500/[0.04] dark:to-pink-500/[0.04] dark:hover:border-white/[0.1]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span
              key={factIndex}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-2xl"
            >
              {["🤖", "⚡", "🧠", "📊", "🚀", "🔥", "💎", "✨"][factIndex]}
            </motion.span>
            <AnimatePresence mode="wait">
              <motion.p
                key={factIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {FACTS[factIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <span className="text-[10px] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100">
            Click for more
          </span>
        </div>
      </motion.button>
    </>
  );
}
