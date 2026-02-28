"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  GitBranch,
  Clock,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { GlassCard } from "./glass-card";
import { StatusPulse } from "./status-pulse";
import { DEPLOYMENT } from "@/lib/openclaw-data";

export function DeploymentStatus() {
  const lastDeployDate = new Date(DEPLOYMENT.lastDeploy);
  const timeAgo = getTimeAgo(lastDeployDate);

  return (
    <GlassCard delay={0.6}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20">
            <Rocket size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Deployment
            </h2>
            <p className="text-xs text-zinc-500">{DEPLOYMENT.platform}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 dark:bg-emerald-500/10">
          <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
            LIVE
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <InfoRow
          icon={<GitBranch size={14} />}
          label="Service"
          value={DEPLOYMENT.service}
        />
        <InfoRow
          icon={<GitBranch size={14} />}
          label="Branch"
          value={DEPLOYMENT.branch}
        />
        <InfoRow
          icon={<Clock size={14} />}
          label="Last Deploy"
          value={timeAgo}
        />
        <InfoRow
          icon={<RefreshCw size={14} />}
          label="Build Time"
          value={`${Math.round(DEPLOYMENT.buildTimeSeconds / 60)}m ${DEPLOYMENT.buildTimeSeconds % 60}s`}
        />

        {/* Last commit */}
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
          <p className="text-[10px] text-zinc-500">Latest Commit</p>
          <p className="mt-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {DEPLOYMENT.lastCommit}
          </p>
        </div>

        {/* Auto-deploy badge */}
        <div className="flex items-center gap-2">
          <StatusPulse
            status={DEPLOYMENT.autoDeploy ? "online" : "offline"}
            size="sm"
          />
          <span className="text-xs text-zinc-500">
            Auto-deploy {DEPLOYMENT.autoDeploy ? "enabled" : "disabled"} · git
            push → live
          </span>
        </div>

        {/* GitHub link */}
        <a
          href={`https://github.com/${DEPLOYMENT.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400"
        >
          <ExternalLink size={12} />
          {DEPLOYMENT.repo}
        </a>
      </div>
    </GlassCard>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        {value}
      </span>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}
