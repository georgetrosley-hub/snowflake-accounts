"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { CompetitorCard } from "@/components/ui/competitor-card";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { ClaudeSparkle } from "@/components/ui/claude-logo";
import type { Account, Competitor } from "@/types";

const categoryOrder = ["frontier", "coding", "search", "workflow", "cloud", "vertical"] as const;
const categoryLabels: Record<string, string> = {
  frontier: "Frontier models",
  coding: "Coding tools",
  search: "Search & knowledge",
  workflow: "Workflow platforms",
  cloud: "Cloud incumbents",
  vertical: "Vertical",
};

interface CompetitiveBattlefieldProps {
  competitors: Competitor[];
  account: Account;
}

export function CompetitiveBattlefield({ competitors, account }: CompetitiveBattlefieldProps) {
  const byCategory = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    items: competitors
      .filter((c) => c.category === cat)
      .sort((a, b) => b.accountRiskLevel - a.accountRiskLevel)
      .slice(0, 4),
  }));

  const topRisk = competitors
    .filter((c) => c.accountRiskLevel >= 70)
    .sort((a, b) => b.accountRiskLevel - a.accountRiskLevel)[0];

  const battleCard = useStreaming();
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  const generateBattleCard = useCallback(
    (competitorName: string) => {
      setSelectedCompetitor(competitorName);
      battleCard.startStream({
        url: "/api/generate",
        body: {
          type: "battle_card",
          account,
          competitors,
          context: `Generate a battle card specifically for displacing or defending against ${competitorName} at ${account.name}. Focus on what matters for this specific account.`,
        },
      });
    },
    [account, competitors, battleCard]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-12"
    >
      <SectionHeader
        title="Competitive landscape"
        subtitle="Account positioning intelligence"
      />

      {topRisk && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="rounded-lg border border-claude-coral/15 bg-claude-coral/[0.03] px-6 py-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-claude-coral/50 mb-2">
                Primary competitive pressure
              </p>
              <p className="text-[15px] font-medium text-text-primary">{topRisk.name}</p>
              <p className="mt-1 text-[13px] text-text-secondary">{topRisk.strengthAreas.slice(0, 2).join(" · ")}</p>
            </div>
            <button
              onClick={() => generateBattleCard(topRisk.name)}
              disabled={battleCard.isStreaming}
              className="flex items-center gap-2 rounded-lg border border-claude-coral/20 bg-claude-coral/[0.06] px-3 py-2 text-[12px] font-medium text-claude-coral/90 hover:bg-claude-coral/10 transition-colors disabled:opacity-50 shrink-0"
            >
              <Swords className="h-3.5 w-3.5" />
              Generate Battle Card
            </button>
          </div>
        </motion.div>
      )}

      {(battleCard.content || battleCard.isStreaming) && (
        <StreamingContent
          content={battleCard.content}
          isStreaming={battleCard.isStreaming}
          onRegenerate={() => selectedCompetitor && generateBattleCard(selectedCompetitor)}
          label={`Battle Card: ${selectedCompetitor}`}
        />
      )}

      <div className="space-y-10">
        {byCategory.filter(({ items }) => items.length > 0).map(({ category, label, items }) => (
          <div key={category}>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
              {label}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((c) => (
                <div key={c.id} className="group relative">
                  <CompetitorCard competitor={c} />
                  <button
                    onClick={() => generateBattleCard(c.name)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 bg-surface-elevated/80 text-text-muted hover:text-claude-coral/80"
                    title={`Battle card for ${c.name}`}
                  >
                    <ClaudeSparkle size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
