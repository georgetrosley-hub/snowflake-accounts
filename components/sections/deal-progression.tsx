"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { ClaudeActionBar } from "@/components/ui/claude-action-bar";
import { getFlagshipDealContext } from "@/data/flagship-deals";
import { useToast } from "@/app/context/toast-context";
import { getPlansForThisWeek } from "@/lib/plans-for-week";
import type { Account, AccountUpdate, Competitor, ExecutionItem, WorkspaceDraft } from "@/types";

interface DealProgressionProps {
  account: Account;
  competitors: Competitor[];
  workspaceDraft: WorkspaceDraft;
  accountUpdates: AccountUpdate[];
  executionItems: ExecutionItem[];
  onUpdateWorkspaceField: (field: keyof WorkspaceDraft, value: string) => void;
  onAddAccountUpdate: (
    title: string,
    note: string,
    tag: AccountUpdate["tag"]
  ) => void;
}

export function DealProgression({
  account,
  competitors,
  workspaceDraft,
  accountUpdates,
  executionItems,
  onUpdateWorkspaceField,
  onAddAccountUpdate,
}: DealProgressionProps) {
  const saveToastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();
  const flagshipDeal = getFlagshipDealContext(account.id);
  const plansForThisWeek = getPlansForThisWeek(accountUpdates, executionItems);

  const handleWorkspaceFieldChange = useCallback(
    (field: keyof WorkspaceDraft, value: string) => {
      onUpdateWorkspaceField(field, value);
      if (saveToastRef.current) clearTimeout(saveToastRef.current);
      saveToastRef.current = setTimeout(() => {
        showToast("Saved");
        saveToastRef.current = null;
      }, 600);
    },
    [onUpdateWorkspaceField, showToast]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-10 sm:space-y-12"
    >
      {flagshipDeal && (
        <section className="space-y-4">
          <SectionHeader
            title="Deal progress"
            subtitle={`Named champion, pilot criteria, and competitive battle for ${account.name}.`}
          />
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 space-y-6">
              <div className="rounded-[22px] border border-accent/20 bg-white/[0.02] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Champion</p>
                <p className="mt-2 text-[15px] font-medium text-text-primary">
                  {flagshipDeal.championName} · {flagshipDeal.championTitle}
                </p>
                {flagshipDeal.lastCallSummary && (
                  <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                    {flagshipDeal.lastCallSummary}
                  </p>
                )}
              </div>
              <div className="rounded-[22px] border border-accent/20 bg-white/[0.02] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Pilot criteria</p>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                  {flagshipDeal.pilotCriteria.scope}
                </p>
                <ul className="mt-3 space-y-1 text-[12px] text-text-muted">
                  {flagshipDeal.pilotCriteria.successMetrics.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[12px] text-text-faint">
                  {flagshipDeal.pilotCriteria.timeline} · Owner: {flagshipDeal.pilotCriteria.owner}
                </p>
              </div>
              <div className="rounded-[22px] border border-accent/20 bg-white/[0.02] px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Competitive battle</p>
                <p className="mt-2 text-[13px] font-medium text-text-primary">
                  Incumbent: {flagshipDeal.competitiveBattle.incumbent}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                  {flagshipDeal.competitiveBattle.displacementStrategy}
                </p>
                <p className="mt-3 text-[12px] text-accent/80">
                  Win condition: {flagshipDeal.competitiveBattle.winCondition}
                </p>
              </div>
            </div>
            <div className="rounded-[22px] border border-accent/20 bg-white/[0.02] px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Deal milestones</p>
              <div className="mt-4 space-y-3">
                {flagshipDeal.milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className={`shrink-0 mt-0.5 h-2 w-2 rounded-full ${
                        m.status === "done"
                          ? "bg-emerald-500/80"
                          : m.status === "in_progress"
                            ? "bg-accent/80"
                            : "bg-white/30"
                      }`}
                    />
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{m.label}</p>
                      <p className="text-[11px] text-text-muted">
                        {m.date}
                        {m.owner ? ` · ${m.owner}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <section className="min-w-0 rounded-[28px] border border-white/8 bg-white/[0.03] p-4 sm:p-6">
          <SectionHeader
            title="AE control board"
            subtitle="This is the editable layer: the account thesis, the win theme, the weekly focus, and the notes the rep actually lives in."
          />
          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                Deal thesis
              </label>
              <textarea
                value={workspaceDraft.dealThesis}
                onChange={(event) => handleWorkspaceFieldChange("dealThesis", event.target.value)}
                rows={3}
                placeholder="e.g. Why we'll win this account, how we're positioned vs incumbent, key proof points…"
                className="w-full resize-none rounded-[22px] border border-accent/25 bg-surface-muted/20 px-4 py-3 text-[13px] font-normal leading-relaxed text-text-muted placeholder:text-text-faint/60 focus:border-accent/40 focus:outline-none focus:text-text-primary focus:placeholder:opacity-0"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                Win theme
              </label>
              <textarea
                value={workspaceDraft.winTheme}
                onChange={(event) => handleWorkspaceFieldChange("winTheme", event.target.value)}
                rows={3}
                placeholder="e.g. One-line narrative the champion uses internally, outcome we're tying to…"
                className="w-full resize-none rounded-[22px] border border-accent/25 bg-surface-muted/20 px-4 py-3 text-[13px] font-normal leading-relaxed text-text-muted placeholder:text-text-faint/60 focus:border-accent/40 focus:outline-none focus:text-text-primary focus:placeholder:opacity-0"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                Operator notes
              </label>
              <textarea
                value={workspaceDraft.operatorNotes}
                onChange={(event) => handleWorkspaceFieldChange("operatorNotes", event.target.value)}
                rows={4}
                placeholder="e.g. Call prep, follow-ups, internal alignment, things to remember…"
                className="w-full resize-none rounded-[22px] border border-accent/25 bg-surface-muted/20 px-4 py-3 text-[13px] font-normal leading-relaxed text-text-muted placeholder:text-text-faint/60 focus:border-accent/40 focus:outline-none focus:text-text-primary focus:placeholder:opacity-0"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (saveToastRef.current) clearTimeout(saveToastRef.current);
                    showToast("Saved");
                  }}
                  className="touch-target min-h-[44px] rounded-xl border border-surface-border/60 bg-white/80 px-4 py-2.5 text-[13px] font-medium text-text-primary shadow-sm transition active:bg-white hover:border-accent/30 hover:bg-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = "Operator notes";
                    const note = workspaceDraft.operatorNotes.trim() || "—";
                    onAddAccountUpdate(title, note, "internal");
                    showToast("Added to account log");
                  }}
                  className="touch-target min-h-[44px] rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-[13px] font-medium text-accent transition active:bg-accent/15 hover:border-accent/50 hover:bg-accent/15"
                >
                  Add to notes
                </button>
              </div>
            </div>
          </div>
        </section>

        <ClaudeActionBar
          title="Ask inside the capture plan"
          subtitle="Get deal-specific suggestions. These requests are tailored to the account you're in."
          account={account}
          competitors={competitors}
          actions={[
            {
              id: "sharpen-thesis",
              label: "Sharpen thesis",
              prompt: `Rewrite my current deal thesis for ${account.name} so it sounds like a top enterprise AE's account strategy. Current thesis: ${workspaceDraft.dealThesis}`,
            },
            {
              id: "pilot-plan",
              label: "Write pilot plan",
              prompt: `Write a concrete first-pilot plan for ${account.name} around ${account.firstWedge}. Include sponsor, scope, success criteria, security path, and next executive step.`,
            },
            {
              id: "competitive-plan",
              label: "Pressure-test competitor",
              prompt: `Pressure-test my win theme for ${account.name}. Win theme: ${workspaceDraft.winTheme}. Tell me where it is weak, what the top competitor will say, and how I should tighten it.`,
            },
            {
              id: "weekly-attack-plan",
              label: "Build weekly attack plan",
              prompt: `Turn this week's priorities into a practical attack plan for ${account.name}. Plans for this week (from notes and progress):\n\n${plansForThisWeek}\n\nI want owners, sequence, and suggested messaging.`,
            },
          ]}
        />
      </div>
    </motion.div>
  );
}
