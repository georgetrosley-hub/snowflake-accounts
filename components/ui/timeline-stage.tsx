"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DealStageInfo } from "@/types";

interface TimelineStageProps {
  stage: DealStageInfo;
  index: number;
  isLast?: boolean;
}

export function TimelineStage({ stage, index, isLast }: TimelineStageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center pt-0.5">
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium",
            stage.current && "border-accent/60 bg-accent/5 text-accent-muted",
            stage.completed && !stage.current && "border-surface-border bg-surface-muted/30 text-text-muted",
            !stage.completed && !stage.current && "border-surface-border/70 bg-transparent text-text-faint"
          )}
        >
          {stage.completed ? "✓" : index + 1}
        </div>
        {!isLast && (
          <div className="my-0.5 h-10 w-px bg-surface-border/60" />
        )}
      </div>
      <div className="flex-1 pb-8">
        <p
          className={cn(
            "text-[13px]",
            stage.current ? "font-medium text-text-primary" : "text-text-secondary"
          )}
        >
          {stage.label}
        </p>
        <div className="mt-1 flex gap-4 text-[11px] text-text-muted">
          <span>{stage.confidence}%</span>
          <span className="text-accent-muted">${stage.projectedArr.toFixed(2)}M</span>
        </div>
        {stage.blockers.length > 0 && (
          <p className="mt-2 text-[11px] text-text-faint leading-relaxed">
            {stage.blockers.join(" · ")}
          </p>
        )}
      </div>
    </motion.div>
  );
}
