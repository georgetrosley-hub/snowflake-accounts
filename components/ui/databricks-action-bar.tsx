"use client";

import { useState } from "react";
import { DatabricksLogoIcon } from "@/components/ui/databricks-logo";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { cn } from "@/lib/utils";
import type { Account, Competitor } from "@/types";

interface DatabricksAction {
  id: string;
  label: string;
  prompt: string;
}

interface DatabricksActionBarProps {
  title: string;
  subtitle?: string;
  account: Account;
  competitors: Competitor[];
  actions: DatabricksAction[];
  className?: string;
}

export function DatabricksActionBar({
  title,
  subtitle,
  account,
  competitors,
  actions,
  className,
}: DatabricksActionBarProps) {
  const generation = useStreaming();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const activeAction = actions.find((action) => action.id === activeActionId) ?? null;

  const runAction = (action: DatabricksAction) => {
    setActiveActionId(action.id);
    setActiveLabel(action.label);
    generation.startStream({
      url: "/api/chat",
      body: {
        messages: [{ role: "user", content: action.prompt }],
        account,
        competitors,
      },
    });
  };

  const runCustom = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    setActiveActionId(null);
    setActiveLabel("Custom question");
    generation.startStream({
      url: "/api/chat",
      body: {
        messages: [{ role: "user", content: trimmed }],
        account,
        competitors,
      },
    });
  };

  return (
    <section className={cn("min-w-0 rounded-[28px] border-2 border-accent/40 bg-accent/[0.08] p-4 sm:p-6", className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-accent/[0.12]">
          <DatabricksLogoIcon size={14} className="text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-text-primary">{title}</p>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-text-muted">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => runAction(action)}
            className={cn(
              "touch-target min-h-[44px] rounded-lg border-2 px-4 py-2.5 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 active:scale-[0.98]",
              activeActionId === action.id
                ? "border-accent bg-accent/[0.12] text-accent shadow-sm"
                : "border-surface-border bg-surface-muted/40 text-text-primary hover:border-accent/50 hover:bg-accent/[0.06] hover:text-accent/90"
            )}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="mt-4 sm:mt-5">
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint/80">
          Or ask Databricks AI something else
        </label>
        <div className="relative rounded-[22px] border border-surface-border/40 bg-surface-muted/20 transition-colors focus-within:border-accent/30 focus-within:bg-surface-muted/30">
          <textarea
            value={customText}
            onChange={(event) => setCustomText(event.target.value)}
            rows={4}
            placeholder="e.g. Pressure-test this update, write follow-up messaging, or ask for a different angle on the deal..."
            className="w-full resize-none rounded-[22px] border-0 bg-transparent px-4 pt-4 pb-12 pr-24 text-[13px] leading-relaxed text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-0 sm:pr-28"
          />
          <button
            type="button"
            onClick={runCustom}
            disabled={!customText.trim()}
            className="touch-target absolute bottom-3 right-3 flex min-h-[40px] min-w-[44px] items-center justify-center rounded-lg px-3 py-2 text-[12px] font-medium text-accent transition-colors active:bg-accent/15 hover:bg-accent/10 disabled:pointer-events-none disabled:opacity-40"
          >
            Ask Databricks AI
          </button>
        </div>
      </div>

      {(generation.content || generation.isStreaming) && (
        <StreamingContent
          content={generation.content}
          isStreaming={generation.isStreaming}
          onRegenerate={activeAction ? () => runAction(activeAction) : undefined}
          label={activeLabel ?? activeAction?.label}
          className="mt-5"
        />
      )}
    </section>
  );
}
