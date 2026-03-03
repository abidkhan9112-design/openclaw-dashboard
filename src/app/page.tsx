"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { SectionNav, type SectionId } from "@/components/layout/section-nav";
import { HeroStatus } from "@/components/features/hero-status";
import { ChannelCard } from "@/components/channel-card";
import { ModelChain } from "@/components/model-chain";
import { SkillGrid } from "@/components/skill-grid";
import { ActivityChart } from "@/components/activity-chart";
import { MemoryStats } from "@/components/memory-stats";
import { DeploymentStatus } from "@/components/deployment-status";
import { CostTracker } from "@/components/cost-tracker";
import { SystemHealth } from "@/components/system-health";
import { ChatConsole } from "@/components/features/chat-console";
import { FunFactBanner } from "@/components/fun-easter-egg";
import { ToastProvider } from "@/components/ui/toast-notification";
import { GatewayStatusProvider } from "@/lib/use-gateway-status";
import { CHANNELS } from "@/lib/openclaw-data";

export default function MissionControl() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  return (
    <GatewayStatusProvider>
    <ToastProvider>
      <div className="min-h-screen">
        <AnimatedBackground />
        <Header />
        <SectionNav active={activeSection} onChange={setActiveSection} />

        <main className="mx-auto max-w-7xl px-3 pb-8 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {activeSection === "overview" && (
              <SectionPanel key="overview">
                {/* Hero Status */}
                <HeroStatus />

                {/* Fun Fact Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <FunFactBanner />
                </motion.div>

                {/* Channel Status */}
                <SectionHeader title="Channels" subtitle="Live messaging platforms" />
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {CHANNELS.map((channel, i) => (
                    <ChannelCard key={channel.id} channel={channel} index={i} />
                  ))}
                </div>

                {/* Activity + Memory */}
                <SectionHeader title="Activity" subtitle="Message throughput & memory" />
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                  <ActivityChart />
                  <MemoryStats />
                </div>
              </SectionPanel>
            )}

            {activeSection === "models" && (
              <SectionPanel key="models">
                <SectionHeader title="AI Model Stack" subtitle="Fallback routing chain with model selection" />
                <ModelChain />
              </SectionPanel>
            )}

            {activeSection === "skills" && (
              <SectionPanel key="skills">
                <SectionHeader title="Skills & Plugins" subtitle="Toggle and manage installed capabilities" />
                <SkillGrid />
              </SectionPanel>
            )}

            {activeSection === "operations" && (
              <SectionPanel key="operations">
                <SectionHeader title="Operations" subtitle="Deployment, costs & system health" />
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DeploymentStatus />
                  <CostTracker />
                  <SystemHealth />
                </div>
              </SectionPanel>
            )}

            {activeSection === "console" && (
              <SectionPanel key="console">
                <ChatConsole />
              </SectionPanel>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200/50 py-6 text-center dark:border-white/[0.04]">
          <p className="text-[10px] text-zinc-400 font-data">
            OpenClaw Mission Control v2.0 · Next.js · Tailwind · Framer Motion · Recharts
          </p>
        </footer>
      </div>
    </ToastProvider>
    </GatewayStatusProvider>
  );
}

function SectionPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {children}
    </motion.div>
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
    <div>
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      <p className="text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}
