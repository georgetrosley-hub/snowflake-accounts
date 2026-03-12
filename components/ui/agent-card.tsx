"use client";

import { cn } from "@/lib/utils";
import type { Agent } from "@/types";

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
}

const statusStyles = {
  idle: "text-text-faint",
  analyzing: "text-text-muted",
  recommending: "text-claude-coral/70",
  awaiting_approval: "text-claude-coral",
};

export function AgentCard({ agent, compact }: AgentCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-surface-border/50 bg-surface/40 px-3 py-2.5",
        compact && "py-2"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium text-text-primary">
            {agent.name}
          </p>
          {!compact && agent.activeRecommendation && (
            <p className="mt-1 line-clamp-2 text-[11px] text-text-muted">
              {agent.activeRecommendation}
            </p>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 text-[10px]",
            statusStyles[agent.status]
          )}
        >
          {agent.status.replace("_", " ")}
        </span>
      </div>
    </div>
  );
}
