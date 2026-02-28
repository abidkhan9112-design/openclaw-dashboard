"use client";

import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { ChannelCard } from "@/components/channel-card";
import { ModelChain } from "@/components/model-chain";
import { SkillGrid } from "@/components/skill-grid";
import { ActivityChart } from "@/components/activity-chart";
import { MemoryStats } from "@/components/memory-stats";
import { DeploymentStatus } from "@/components/deployment-status";
import { CostTracker } from "@/components/cost-tracker";
import { SystemHealth } from "@/components/system-health";
import { FunFactBanner } from "@/components/fun-easter-egg";
import { CHANNELS } from "@/lib/openclaw-data";

export default function MissionControl() {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ───── Fun Fact Banner ───── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <FunFactBanner />
        </motion.section>

        {/* ───── Section: Channel Status ───── */}
        <SectionHeader title="Channels" subtitle="Live messaging platforms" />
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {CHANNELS.map((channel, i) => (
            <ChannelCard key={channel.id} channel={channel} index={i} />
          ))}
        </div>

        {/* ───── Section: AI Model Chain ───── */}
        <SectionHeader
          title="AI Model Stack"
          subtitle="Fallback routing chain"
        />
        <div className="mb-8">
          <ModelChain />
        </div>

        {/* ───── Section: Activity + Memory + Deploy + Cost (Bento Grid) ───── */}
        <SectionHeader
          title="Operations"
          subtitle="Activity, memory, deployment & costs"
        />
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <ActivityChart />
          <MemoryStats />
        </div>
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <DeploymentStatus />
          <CostTracker />
          <SystemHealth />
        </div>

        {/* ───── Section: Skills Grid ───── */}
        <SectionHeader
          title="Skills & Plugins"
          subtitle="Installed capabilities"
        />
        <div className="mb-8">
          <SkillGrid />
        </div>
      </main>

      {/* ───── Footer ───── */}
      <footer className="border-t border-zinc-200/50 py-6 text-center dark:border-white/[0.05]">
        <p className="text-xs text-zinc-400">
          OpenClaw Mission Control · Built with Next.js, Tailwind CSS, Framer
          Motion & Recharts
        </p>
      </footer>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-4"
    >
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      <p className="text-xs text-zinc-500">{subtitle}</p>
    </motion.div>
  );
}
