"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Competitor } from "@/types";

interface CompetitorCardProps {
  competitor: Competitor;
}

function riskLabel(risk: number) {
  if (risk >= 80) return "High";
  if (risk >= 60) return "Medium";
  return "Low";
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const isHighRisk = competitor.accountRiskLevel >= 70;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-md border px-4 py-4 transition-colors duration-200",
        isHighRisk
          ? "border-accent/15 bg-accent/[0.03] hover:bg-accent/[0.05]"
          : "border-surface-border/50 bg-surface-elevated/40 hover:bg-surface-elevated/60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-medium text-text-primary">
            {competitor.name}
          </h3>
          <p className="mt-1.5 text-[12px] text-text-muted leading-relaxed">
            {competitor.strengthAreas.slice(0, 2).join(" · ")}
          </p>
          {competitor.detectedFootprint && (
            <p className="mt-1.5 text-[11px] text-text-faint">
              {competitor.detectedFootprint}
            </p>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            competitor.accountRiskLevel >= 80 && "bg-accent/10 text-accent/80",
            competitor.accountRiskLevel >= 60 && competitor.accountRiskLevel < 80 && "bg-surface-muted/60 text-text-muted",
            competitor.accountRiskLevel < 60 && "text-text-faint"
          )}
        >
          {riskLabel(competitor.accountRiskLevel)}
        </span>
      </div>
    </motion.div>
  );
}
