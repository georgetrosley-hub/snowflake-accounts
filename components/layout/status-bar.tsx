"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Account } from "@/types";

interface StatusBarProps {
  account: Account;
  accounts: Account[];
  onAccountChange: (id: string) => void;
  pipelineTarget: number;
  estimatedArr: number;
  dealStage: string;
  competitivePressure: number;
  activeAgents: number;
  oversightStatus: "active" | "idle";
}

export function StatusBar({
  account,
  accounts,
  onAccountChange,
  pipelineTarget,
  estimatedArr,
  dealStage,
  activeAgents,
  oversightStatus,
}: StatusBarProps) {
  return (
    <header className="flex h-11 shrink-0 items-center border-b border-surface-border/60 bg-surface-elevated/40 px-6">
      <div className="flex items-center gap-8">
        <div className="relative">
          <select
            value={account.id}
            onChange={(e) => onAccountChange(e.target.value)}
            className={cn(
              "appearance-none rounded bg-transparent py-1.5 pr-7 text-[13px] font-medium text-text-primary",
              "border-none focus:outline-none focus:ring-0"
            )}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        </div>
        <div className="flex items-center gap-6 text-[12px]">
          <span className="text-text-muted">
            <span className="font-medium text-text-primary">${pipelineTarget.toFixed(2)}M</span>
            {" "}pipeline
          </span>
          <span className="text-text-muted">
            <span className="text-accent-muted">${estimatedArr.toFixed(2)}M</span>
            {" "}ARR
          </span>
          <span className="text-text-muted">{dealStage}</span>
          <span className="text-text-muted">
            <span className="text-text-secondary">{activeAgents}</span>
            {" "}agents
          </span>
          <span
            className={cn(
              "text-[11px]",
              oversightStatus === "active" ? "text-accent-muted" : "text-text-faint"
            )}
          >
            {oversightStatus === "active" ? "Approval required" : "Clear"}
          </span>
        </div>
      </div>
    </header>
  );
}
