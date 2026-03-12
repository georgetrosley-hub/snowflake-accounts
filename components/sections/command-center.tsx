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
import { ClaudeSparkle } from "@/components/ui/claude-logo";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import type { Account, Agent, Competitor } from "@/types";

const ease = [0.25, 0.46, 0.45, 0.94];

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
      <section className="mb-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease }}
          className="text-[12px] text-text-muted mb-5"
        >
          account
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
          className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary"
        >
          {account.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease }}
          className="mt-4 text-[18px] text-text-secondary leading-relaxed max-w-2xl"
        >
          {account.firstWedge}
        </motion.p>
      </section>

      {/* Premium metric panel */}
      <section className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="grid gap-10 py-4 sm:grid-cols-3"
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
            <p className="text-3xl sm:text-4xl font-semibold tabular-nums text-claude-coral tracking-tight">
              ${totalOpportunity.toFixed(2)}M
            </p>
          </div>
        </motion.div>
      </section>

      {/* Forecast */}
      <section className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease }}
        >
          <p className="text-[12px] text-text-muted mb-6">Pipeline forecast</p>
          <div className="h-48 lg:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DA7756" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#DA7756" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C06A4B" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#C06A4B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#272523" vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B6560" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6B6560" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={40} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1B1A19", border: "1px solid #302D2A", borderRadius: "8px", padding: "8px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
                  labelStyle={{ color: "#A8A29E", fontSize: 11 }}
                  formatter={(value: number) => [`$${value.toFixed(2)}M`, ""]}
                />
                <Area type="monotone" dataKey="land" stroke="#DA7756" strokeWidth={1.5} fill="url(#landGrad)" />
                <Area type="monotone" dataKey="expansion" stroke="#C06A4B" strokeWidth={1} fill="url(#expGrad)" strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* Context + recommendation */}
      <section className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease }}
          className="space-y-10"
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
          className="rounded-lg bg-surface-elevated/30 p-6"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <ClaudeSparkle size={12} className="text-claude-coral/60" />
              <p className="text-[12px] text-text-muted">Claude recommendation</p>
            </div>
          </div>
          <p className="text-[18px] text-text-primary leading-relaxed">
            {currentRecommendation}
          </p>
        </motion.div>
      </section>

      {/* Claude-powered strategy + weekly plan */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={generateStrategy}
            disabled={strategy.isStreaming}
            className="flex items-center gap-2 rounded-lg border border-claude-coral/20 bg-claude-coral/[0.06] px-4 py-2.5 text-[13px] font-medium text-claude-coral/90 hover:bg-claude-coral/10 transition-colors disabled:opacity-50"
          >
            {strategy.isStreaming ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ClaudeSparkle size={14} className="text-claude-coral" />
            )}
            {strategyLoaded ? "Refresh Strategy" : "Generate Strategy Assessment"}
          </button>
          <button
            onClick={generateWeeklyPlan}
            disabled={weeklyPlan.isStreaming}
            className="flex items-center gap-2 rounded-lg border border-surface-border/40 bg-surface-elevated/30 px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-surface-elevated/50 transition-colors disabled:opacity-50"
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
