"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, Zap } from "lucide-react";
import { DatabricksLogoIcon } from "@/components/ui/databricks-logo";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import type { Account, Agent, Competitor } from "@/types";

const ease = [0.25, 0.46, 0.45, 0.94];
const chartGridColor = "rgb(var(--surface-divider))";
const chartTickColor = "rgb(var(--text-muted))";
const chartTooltipBackground = "rgb(var(--surface-elevated))";
const chartTooltipBorder = "1px solid rgb(var(--surface-border))";
const chartTooltipLabel = "rgb(var(--text-secondary))";
const chartAccent = "rgb(var(--accent))";
const chartAccentMuted = "rgb(var(--accent-muted))";

interface CommandCenterProps {
  account: Account;
  agents: Agent[];
  competitors: Competitor[];
  currentRecommendation: string;
  forecastData: { month: string; land: number; expansion: number }[];
}

export function CommandCenter({
  account,
  competitors,
  currentRecommendation,
  forecastData,
}: CommandCenterProps) {
  const topCompetitors = competitors
    .filter((c) => c.accountRiskLevel >= 70)
    .sort((a, b) => b.accountRiskLevel - a.accountRiskLevel)
    .slice(0, 3);

  const totalOpportunity = account.estimatedLandValue + account.estimatedExpansionValue;

  const strategy = useStreaming();
  const weeklyPlan = useStreaming();
  const [strategyLoaded, setStrategyLoaded] = useState(false);
  const [weeklyLoaded, setWeeklyLoaded] = useState(false);

  const generateStrategy = useCallback(() => {
    setStrategyLoaded(true);
    strategy.startStream({
      url: "/api/generate",
      body: { type: "strategy_assessment", account, competitors },
    });
  }, [account, competitors, strategy]);

  const generateWeeklyPlan = useCallback(() => {
    setWeeklyLoaded(true);
    weeklyPlan.startStream({
      url: "/api/chat",
      body: {
        messages: [
          {
            role: "user",
            content: `Based on the current account context, give me a specific, actionable plan for what I should focus on THIS WEEK for ${account.name}. Include specific people to contact, meetings to schedule, and deliverables to prepare. Be concise — bullet points, no fluff.`,
          },
        ],
        account,
        competitors,
      },
    });
  }, [account, competitors, weeklyPlan]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease }}
      className="min-h-[70vh]"
    >
      {/* Hero */}
      <section className="mb-10 sm:mb-12 lg:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease }}
          className="mb-4 text-[12px] text-text-muted sm:mb-5"
        >
          account
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
          className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
        >
          {account.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease }}
          className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-secondary sm:mt-4 sm:text-[18px]"
        >
          {account.firstWedge}
        </motion.p>
      </section>

      {/* Premium metric panel */}
      <section className="mb-12 sm:mb-16 lg:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="grid gap-6 py-2 sm:grid-cols-3 sm:gap-8 lg:gap-10 lg:py-4"
        >
          <div>
            <p className="text-[12px] text-text-muted mb-1.5">Land</p>
            <p className="text-3xl sm:text-4xl font-semibold tabular-nums text-text-primary tracking-tight">
              ${account.estimatedLandValue.toFixed(2)}M
            </p>
          </div>
          <div>
            <p className="text-[12px] text-text-muted mb-1.5">Expansion</p>
            <p className="text-3xl sm:text-4xl font-semibold tabular-nums text-text-primary tracking-tight">
              ${account.estimatedExpansionValue.toFixed(2)}M
            </p>
          </div>
          <div>
            <p className="text-[12px] text-text-muted mb-1.5">Opportunity</p>
            <p className="text-3xl sm:text-4xl font-semibold tabular-nums text-accent tracking-tight">
              ${totalOpportunity.toFixed(2)}M
            </p>
          </div>
        </motion.div>
      </section>

      {/* Forecast */}
      <section className="mb-12 sm:mb-16 lg:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease }}
        >
          <p className="mb-4 text-[12px] text-text-muted sm:mb-6">Pipeline forecast</p>
          <div className="h-40 sm:h-48 lg:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartAccent} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={chartAccent} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartAccentMuted} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={chartAccentMuted} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke={chartGridColor} vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: chartTickColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: chartTickColor }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={32} />
                <Tooltip
                  contentStyle={{ backgroundColor: chartTooltipBackground, border: chartTooltipBorder, borderRadius: "8px", padding: "8px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.16)" }}
                  labelStyle={{ color: chartTooltipLabel, fontSize: 11 }}
                  formatter={(value: number) => [`$${value.toFixed(2)}M`, ""]}
                />
                <Area type="monotone" dataKey="land" stroke={chartAccent} strokeWidth={1.5} fill="url(#landGrad)" />
                <Area type="monotone" dataKey="expansion" stroke={chartAccentMuted} strokeWidth={1} fill="url(#expGrad)" strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* Context + recommendation */}
      <section className="mb-12 grid gap-8 sm:gap-10 lg:mb-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16 xl:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease }}
          className="space-y-8 sm:space-y-10"
        >
          <div>
            <p className="text-[12px] text-text-muted mb-3">Competitive pressure</p>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              {topCompetitors.map((c) => c.name).join(" · ")}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-text-muted mb-3">Blockers</p>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              {account.topBlockers.slice(0, 2).join(". ")}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-text-muted mb-3">Paths</p>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              {account.topExpansionPaths.slice(0, 2).join(". ")}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease }}
          className="rounded-lg bg-surface-elevated/30 p-4 sm:p-5 lg:p-6"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <DatabricksLogoIcon size={12} className="text-accent/60" />
              <p className="text-[12px] text-text-muted">AI recommendation</p>
            </div>
          </div>
          <p className="text-[16px] leading-relaxed text-text-primary sm:text-[18px]">
            {currentRecommendation}
          </p>
        </motion.div>
      </section>

      {/* AI-powered strategy + weekly plan */}
      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            onClick={generateStrategy}
            disabled={strategy.isStreaming}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-accent/20 bg-accent/[0.06] px-4 py-2.5 text-[13px] font-medium text-accent/90 transition-colors hover:bg-accent/10 disabled:opacity-50 sm:w-auto"
          >
            {strategy.isStreaming ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <DatabricksLogoIcon size={14} className="text-accent" />
            )}
            {strategyLoaded ? "Refresh Strategy" : "Generate Strategy Assessment"}
          </button>
          <button
            onClick={generateWeeklyPlan}
            disabled={weeklyPlan.isStreaming}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-surface-border/40 bg-surface-elevated/30 px-4 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-elevated/50 disabled:opacity-50 sm:w-auto"
          >
            {weeklyPlan.isStreaming ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            {weeklyLoaded ? "Refresh Plan" : "What should I do this week?"}
          </button>
        </div>

        {(strategy.content || strategy.isStreaming) && (
          <StreamingContent
            content={strategy.content}
            isStreaming={strategy.isStreaming}
            onRegenerate={generateStrategy}
            label="Strategic Assessment"
          />
        )}

        {(weeklyPlan.content || weeklyPlan.isStreaming) && (
          <StreamingContent
            content={weeklyPlan.content}
            isStreaming={weeklyPlan.isStreaming}
            onRegenerate={generateWeeklyPlan}
            label="Weekly Action Plan"
          />
        )}
      </section>
    </motion.div>
  );
}
