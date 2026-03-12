"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { OrgNode } from "@/types";

interface OrgNodeCardProps {
  node: OrgNode;
  index?: number;
  className?: string;
}

const statusStyles = {
  latent: "border-surface-border/60 bg-surface/55",
  identified: "border-surface-border bg-surface-elevated/75",
  engaged: "border-accent-subtle/70 bg-surface-elevated/85",
  pilot: "border-accent-muted/70 bg-surface-elevated/90",
  deployed: "border-accent/55 bg-surface-elevated",
};

const statusText: Record<OrgNode["status"], string> = {
  latent: "Latent",
  identified: "Identified",
  engaged: "Engaged",
  pilot: "Pilot",
  deployed: "Deployed",
};

export function OrgNodeCard({ node, index = 0, className }: OrgNodeCardProps) {
  const isActive =
    node.status === "engaged" || node.status === "pilot" || node.status === "deployed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isActive ? [1, 1.012, 1] : 1,
        boxShadow: isActive
          ? [
              "0 0 0 rgba(196,181,154,0)",
              "0 8px 24px rgba(196,181,154,0.17)",
              "0 0 0 rgba(196,181,154,0)",
            ]
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{
        delay: index * 0.02,
        duration: 0.45,
        ease: [0.25, 0.46, 0.45, 0.94],
        boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
      }}
      className={cn(
        "group rounded-md border px-4 py-3 backdrop-blur-sm transition-colors duration-300",
        statusStyles[node.status],
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-[13px] font-medium",
              isActive ? "text-text-primary" : "text-text-secondary"
            )}
          >
            {node.name}
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
            {node.useCase}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-text-faint">
            Status: {statusText[node.status]}
          </p>
          <p className="mt-1 text-[10px] text-text-faint">
            {node.recommendedNextStep}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <span className="text-[12px] font-semibold tabular-nums text-accent">
            ${node.arrPotential.toFixed(2)}M
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-text-muted">
            ARR potential
          </span>
          <span className="mt-1 text-[10px] text-text-muted">
            {node.buyingLikelihood}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
