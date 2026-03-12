"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { CompetitorCard } from "@/components/ui/competitor-card";
import type { Competitor } from "@/types";

const categoryOrder = ["frontier", "coding", "search", "workflow", "cloud", "vertical"] as const;
const categoryLabels: Record<string, string> = {
  frontier: "Frontier models",
  coding: "Coding tools",
  search: "Search and knowledge",
  workflow: "Workflow platforms",
  cloud: "Cloud incumbents",
  vertical: "Vertical",
};

interface CompetitiveBattlefieldProps {
  competitors: Competitor[];
}

export function CompetitiveBattlefield({ competitors }: CompetitiveBattlefieldProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-12"
    >
      <SectionHeader
        title="Competitive landscape"
        subtitle="Account positioning"
      />

      {topRisk && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="rounded-md border border-surface-border/70 bg-surface-elevated/50 px-6 py-5"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-2">
            Primary competitive pressure
          </p>
          <p className="text-[15px] font-medium text-text-primary">{topRisk.name}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{topRisk.strengthAreas.slice(0, 2).join(" · ")}</p>
        </motion.div>
      )}

      <div className="space-y-10">
        {byCategory.filter(({ items }) => items.length > 0).map(({ category, label, items }) => (
            <div key={category}>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">
                {label}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((c) => (
                  <CompetitorCard key={c.id} competitor={c} />
                ))}
              </div>
            </div>
        ))}
      </div>
    </motion.div>
  );
}
