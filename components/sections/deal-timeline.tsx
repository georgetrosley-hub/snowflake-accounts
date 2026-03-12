"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { TimelineStage } from "@/components/ui/timeline-stage";
import type { DealStageInfo } from "@/types";

interface DealTimelineProps {
  stages: DealStageInfo[];
}

export function DealTimeline({ stages }: DealTimelineProps) {
  const currentStage = stages.find((s) => s.current);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Deal timeline"
        subtitle="Stages and projected value"
      />
      {currentStage && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-md border border-accent/20 bg-accent/5 px-5 py-4 max-w-xl"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">Current</p>
          <p className="mt-1 text-[15px] font-medium text-text-primary">{currentStage.label}</p>
          <p className="mt-1 text-[12px] text-text-secondary">${currentStage.projectedArr.toFixed(2)}M projected at this phase</p>
        </motion.div>
      )}
      <div className="space-y-0 max-w-xl">
        {stages.map((stage, i) => (
          <TimelineStage
            key={stage.stage}
            stage={stage}
            index={i}
            isLast={i === stages.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
