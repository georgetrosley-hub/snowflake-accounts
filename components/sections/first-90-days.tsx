"use client";

import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Target } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ClaudeActionBar } from "@/components/ui/claude-action-bar";
import type { Account, Competitor, ExecutionItem } from "@/types";

const phases = [
  {
    id: "days-1-30",
    title: "Days 1–30",
    items: [
      "Territory mapping and account prioritization",
      "Product immersion and competitive positioning",
      "Partner ecosystem alignment",
      "Top 50 accounts identified and research started",
    ],
  },
  {
    id: "days-30-60",
    title: "Days 30–60",
    items: [
      "Pipeline generation and discovery motion",
      "Design partner programs launched",
      "Executive outreach sequencing",
      "Champion identification and first pilot scopes",
    ],
  },
  {
    id: "days-60-90",
    title: "Days 60–90",
    items: [
      "Pilots launched with lighthouse accounts",
      "Internal case studies and proof points",
      "Expansion path mapped for top 5",
      "First commercial conversations opened",
    ],
  },
];

interface First90DaysProps {
  account: Account;
  competitors: Competitor[];
  executionItems: ExecutionItem[];
}

export function First90Days({
  account,
  competitors,
  executionItems,
}: First90DaysProps) {
  const thisWeek = executionItems.filter(
    (item) => item.status === "in_progress" || item.status === "ready"
  ).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-10 sm:space-y-12"
    >
      <SectionHeader
        title="First 90 days as Snowflake AE"
        subtitle="Operator thinking: territory → pipeline → pilots. Not ideas, execution."
      />

      <div className="grid gap-6 sm:grid-cols-3">
        {phases.map((phase) => (
          <div
            key={phase.id}
            className="rounded-[22px] border border-surface-border/40 bg-surface-elevated/30 p-4"
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent/75" strokeWidth={1.8} />
              <p className="text-[12px] font-semibold text-text-primary">
                {phase.title}
              </p>
            </div>
            <ul className="mt-4 space-y-2">
              {phase.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[12px] text-text-secondary"
                >
                  <ArrowRight className="mt-1 h-3 w-3 shrink-0 text-accent/60" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-accent/75" strokeWidth={1.8} />
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            This week at {account.name}
          </p>
        </div>
        <div className="space-y-3">
          {thisWeek.length === 0 ? (
            <div className="rounded-[22px] border border-accent/20 bg-white/[0.02] px-4 py-6 text-center text-[14px] text-text-muted">
              No in-progress or ready items. Check the Deal Plan.
            </div>
          ) : (
            thisWeek.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-[22px] border border-accent/20 bg-white/[0.02] px-4 py-4"
              >
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" strokeWidth={1.8} />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-text-primary">{item.title}</p>
                  <p className="mt-1 text-[12px] text-text-muted">
                    {item.owner} · {item.dueLabel}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <ClaudeActionBar
        title="Ask about your first 90 days"
        subtitle="Get a sequenced plan, messaging for the champion, or next-step recommendations."
        account={account}
        competitors={competitors}
        actions={[
          {
            id: "sequence-plan",
            label: "Sequence my first 90 days",
            prompt: `I'm starting as a Snowflake AE. Here are my current items for ${account.name}: ${thisWeek.map((i) => i.title).join("; ")}. Give me a clear 30/60/90 sequence with owners and suggested messaging for the AI Data Cloud.`,
          },
          {
            id: "champion-messaging",
            label: "Champion messaging",
            prompt: `I need internal messaging for my champion at ${account.name}. First wedge: ${account.firstWedge}. Write 2–3 short talking points they can use in a meeting.`,
          },
          {
            id: "next-steps",
            label: "What should I do next?",
            prompt: `For ${account.name}, my items are: ${thisWeek.map((i) => i.title).join("; ")}. What should I prioritize this week and what's the one thing I should do tomorrow?`,
          },
        ]}
      />
    </motion.div>
  );
}
