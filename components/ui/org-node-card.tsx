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
  latent: "bg-transparent",
  identified: "bg-transparent",
  engaged: "bg-transparent",
  pilot: "bg-transparent",
  deployed: "bg-transparent",
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
              "0 0 0 rgba(218,119,86,0)",
              "0 8px 24px rgba(218,119,86,0.12)",
              "0 0 0 rgba(218,119,86,0)",
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
        "group h-full px-5 py-4 transition-colors duration-300",
        statusStyles[node.status],
        className
      )}
    >
      <div className="flex min-h-[152px] items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-[14px] font-semibold leading-snug",
              isActive ? "text-text-primary" : "text-text-secondary"
            )}
          >
            {node.name}
          </h3>
          <p className="mt-1.5 text-[12px] leading-relaxed text-text-muted">
            {node.useCase}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                node.status === "deployed" && "bg-claude-coral",
                node.status === "pilot" && "bg-claude-coral/70",
                node.status === "engaged" && "bg-claude-coral/50",
                node.status === "identified" && "bg-text-muted/50",
                node.status === "latent" && "bg-text-faint/40"
              )}
            />
            <span className="text-[10px] uppercase tracking-[0.08em] text-text-faint">
              {statusText[node.status]}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-text-faint">
            {node.recommendedNextStep}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end text-right">
          <span
            className={cn(
              "text-[13px] font-semibold tabular-nums",
              isActive ? "text-claude-coral" : "text-text-muted"
            )}
          >
            ${node.arrPotential.toFixed(2)}M
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-text-muted">
            ARR
          </span>
          <span className="mt-1 text-[10px] tabular-nums text-text-muted">
            {node.buyingLikelihood}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
