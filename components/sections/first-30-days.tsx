"use client";

import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ClaudeActionBar } from "@/components/ui/claude-action-bar";
import type { Account, Competitor, ExecutionItem } from "@/types";

interface First30DaysProps {
  account: Account;
  competitors: Competitor[];
  executionItems: ExecutionItem[];
}

export function First30Days({
  account,
  competitors,
  executionItems,
}: First30DaysProps) {
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
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-accent/75" strokeWidth={1.8} />
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            My first 30 days
          </p>
        </div>
        <p className="max-w-2xl text-[14px] leading-relaxed text-text-muted">
          The execution items that move the deal: in progress and ready. Use the panel below to get a sequenced plan or messaging suggestions.
        </p>
        <div className="mt-5 space-y-3">
          {thisWeek.length === 0 ? (
            <div className="rounded-[22px] border border-accent/20 bg-white/[0.02] px-4 py-6 text-center text-[14px] text-text-muted">
              No in-progress or ready items this week. Check the Deal Plan for upcoming work.
            </div>
          ) : (
            thisWeek.map((item) => (
              <div
                key={item.id}
                id={`execution-item-${item.id}`}
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
        title="Ask about your first 30 days"
        subtitle="Get a sequenced plan, messaging for the champion, or next-step recommendations for this account."
        account={account}
        competitors={competitors}
        actions={[
          {
            id: "sequence-plan",
            label: "Sequence my first 30 days",
            prompt: `I'm working on ${account.name}. Here are my current in-progress/ready items: ${thisWeek.map((i) => i.title).join("; ")}. Give me a clear week-by-week sequence with owners and suggested messaging.`,
          },
          {
            id: "champion-messaging",
            label: "Champion messaging",
            prompt: `I need internal messaging for my champion at ${account.name} to use with their team. First wedge: ${account.firstWedge}. Write 2–3 short talking points they can use in a meeting.`,
          },
          {
            id: "next-steps",
            label: "What should I do next?",
            prompt: `For ${account.name}, my first 30 days items are: ${thisWeek.map((i) => i.title).join("; ")}. What should I prioritize this week and what's the one thing I should do tomorrow?`,
          },
        ]}
      />
    </motion.div>
  );
}
