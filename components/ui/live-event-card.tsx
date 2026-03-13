"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SimulationEvent } from "@/types";

interface LiveEventCardProps {
  event: SimulationEvent;
  isNew?: boolean;
}

const priorityStyles = {
  low: {
    dot: "bg-text-faint/50",
    label: "Low",
  },
  medium: {
    dot: "bg-text-muted",
    label: "Medium",
  },
  high: {
    dot: "bg-accent/60",
    label: "High",
  },
  critical: {
    dot: "bg-accent",
    label: "Critical",
  },
};

function getAgentInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    const first = parts[0][0] ?? "";
    const last = parts[parts.length - 1][0] ?? "";
    return (first + last).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function LiveEventCard({ event, isNew }: LiveEventCardProps) {
  const priority = priorityStyles[event.priority];
  const displayLine = event.operationalPhrase
    ? `${event.agentName} ${event.operationalPhrase}.`
    : event.title;

  const isCritical = event.priority === "critical" || event.priority === "high";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: isNew ? 12 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: isNew ? 0.5 : 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "group flex gap-4 rounded-md px-5 py-4 transition-colors",
        isCritical
          ? "bg-accent/[0.02] hover:bg-accent/[0.035]"
          : "bg-surface-elevated/20 hover:bg-surface-elevated/35"
      )}
    >
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium",
            isCritical
              ? "border-accent/20 bg-accent/5 text-accent"
              : "border-surface-border/60 bg-surface/60 text-text-secondary"
          )}
        >
          {getAgentInitials(event.agentName)}
        </div>
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", priority.dot)}
          title={priority.label}
        />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[11px] tabular-nums text-text-faint">
            {formatTime(event.timestamp)}
          </span>
          <span
            className={cn("text-[10px]", isCritical ? "text-accent/80" : "text-text-faint")}
          >
            {priority.label}
          </span>
        </div>
        <p className="mt-2 text-[14px] font-medium text-text-primary leading-relaxed">
          {displayLine}
        </p>
        <p className="mt-1.5 text-[13px] text-text-secondary leading-relaxed">
          {event.explanation}
        </p>
        {event.recommendedAction && (
          <p className="mt-3 text-[12px] text-accent/80">
            {event.recommendedAction}
          </p>
        )}
      </div>
    </motion.article>
  );
}
