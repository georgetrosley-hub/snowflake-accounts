"use client";

import { useMemo, useRef, useCallback } from "react";
import { ArrowRight, Crosshair, CircleDot, Zap, Target } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import type { SectionId } from "@/components/layout/sidebar";
import { MetricCard } from "@/components/ui/metric-card";
import { SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";
import { useToast } from "@/app/context/toast-context";
import { isStale } from "@/lib/deal-health";
import { getPlansForThisWeek, getPlansForThisWeekShort } from "@/lib/plans-for-week";
import type {
  Account,
  AccountSignal,
  AccountUpdate,
  Competitor,
  ExecutionItem,
  Stakeholder,
  WorkspaceDraft,
} from "@/types";
import type { DealHealthSummary } from "@/lib/deal-health";

function getTodayLabel() {
  const d = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function formatMillionCurrency(value: number): string | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return `$${value.toFixed(2)}M`;
}

interface OverviewProps {
  account: Account;
  competitors: Competitor[];
  signals: AccountSignal[];
  stakeholders: Stakeholder[];
  executionItems: ExecutionItem[];
  accountUpdates: AccountUpdate[];
  workspaceDraft: WorkspaceDraft;
  pipelineTarget: number;
  currentRecommendation: string;
  dealHealth: DealHealthSummary;
  onUpdateWorkspaceField: (field: keyof WorkspaceDraft, value: string) => void;
  onAddAccountUpdate: (
    title: string,
    note: string,
    tag: AccountUpdate["tag"]
  ) => void;
  onSectionChange?: (id: SectionId) => void;
}

export function Overview({
  account,
  competitors,
  signals,
  stakeholders,
  executionItems,
  accountUpdates,
  workspaceDraft,
  pipelineTarget,
  currentRecommendation,
  dealHealth,
  onUpdateWorkspaceField,
  onAddAccountUpdate,
  onSectionChange,
}: OverviewProps) {
  const saveToastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

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
  const topCompetitor = [...competitors].sort((a, b) => b.accountRiskLevel - a.accountRiskLevel)[0];
  const champion = stakeholders.find((stakeholder) => stakeholder.stance === "champion");
  const championCount = stakeholders.filter(
    (stakeholder) => stakeholder.stance === "champion" || stakeholder.stance === "ally"
  ).length;
  const blockedCount = executionItems.filter((item) => item.status === "blocked").length;
  const firstDecision = executionItems.find((item) => item.phase === "Land");
  const expansionItem = executionItems.find((item) => item.phase === "Expansion");

  const todayLabel = useMemo(() => getTodayLabel(), []);
  const topPriority = executionItems.find((i) => i.status === "blocked") ?? executionItems.find((i) => i.status === "in_progress");
  const lastUpdate = accountUpdates[0];
  const plansForThisWeek = useMemo(
    () => getPlansForThisWeek(accountUpdates, executionItems),
    [accountUpdates, executionItems]
  );
  const plansForThisWeekShort = useMemo(
    () => getPlansForThisWeekShort(accountUpdates, executionItems),
    [accountUpdates, executionItems]
  );

  const blockedItems = executionItems.filter((i) => i.status === "blocked");
  const needsAttention = executionItems.filter(
    (i) => i.decisionRequired && i.decisionStatus === "pending"
  );
  const staleItems = executionItems.filter((i) => isStale(i.lastUpdated));
  const firstPilotValue = formatMillionCurrency(account.estimatedLandValue);
  const expansionPathValue = formatMillionCurrency(account.estimatedExpansionValue);
  const inPlayValue = formatMillionCurrency(pipelineTarget);

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero */}
      <div className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SnowflakeLogoIcon size={32} className="shrink-0 opacity-95" />
            <div>
              <h1 className="text-[18px] font-semibold tracking-tight text-text-primary sm:text-[20px]">
                How I Would Operate and Expand This Snowflake Territory
              </h1>
              <p className="mt-0.5 text-[13px] text-text-muted">
                A practical system for prioritizing accounts, tracking market signals, and converting insight into action.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-text-secondary">
          This territory view is built for execution cadence: clear priorities, active deal movement, and disciplined expansion planning.
        </p>
      </div>

      {/* Territory priorities */}
      <section className="space-y-4">
        <SectionHeader
          title="Territory priorities"
          subtitle="What I would own now: landable wedge, expansion path, stakeholder coverage, and near-term revenue focus."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Revenue in motion"
            value={inPlayValue ?? "Priority accounts scoped"}
            subtitle={inPlayValue ? "Near-term land + expansion focus" : "Current week is focused on qualification and wedge definition"}
          />
          <MetricCard
            label="First pilot"
            value={firstPilotValue ?? "Pilot scope in progress"}
            subtitle={account.firstWedge}
          />
          <MetricCard
            label="Expansion path"
            value={expansionPathValue ?? "Expansion thesis defined"}
            subtitle={account.topExpansionPaths[0]}
          />
          <MetricCard
            label="Deal coverage"
            value={`${championCount} active threads`}
            subtitle={`${blockedCount} blocker${blockedCount === 1 ? "" : "s"} requiring active management`}
          />
        </div>
      </section>

      {/* Daily account briefing */}
      <section className="rounded-2xl border border-surface-border bg-surface-elevated p-4 sm:p-6 shadow-elevated">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              {todayLabel} · {account.name}
            </p>
            <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
              Daily account briefing
            </h1>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium ${
              dealHealth.status === "healthy"
                ? "bg-emerald-500/10 text-emerald-400/90"
                : dealHealth.status === "attention"
                  ? "bg-accent/10 text-accent/90"
                  : "bg-rose-500/10 text-rose-400/90"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                dealHealth.status === "healthy"
                  ? "bg-emerald-400"
                  : dealHealth.status === "attention"
                    ? "bg-accent"
                    : "bg-rose-400"
              }`}
            />
            {dealHealth.label}
          </div>
          {blockedItems.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1.5 text-[12px] font-medium text-rose-400/95">
              <CircleDot className="h-3.5 w-3.5" />
              {blockedItems.length} blocker{blockedItems.length === 1 ? "" : "s"}
            </div>
          )}
          {needsAttention.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[12px] font-medium text-accent/90">
              {needsAttention.length} decision{needsAttention.length === 1 ? "" : "s"} pending
            </div>
          )}
          {staleItems.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-[12px] text-text-muted">
              {staleItems.length} stale workstream{staleItems.length === 1 ? "" : "s"}
            </div>
          )}
        </div>
        <p className="mt-3 text-[12px] text-text-muted">{dealHealth.reason}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => document.getElementById("plans-for-this-week-detail")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="flex min-h-[88px] touch-target flex-col justify-start rounded-xl border border-accent/25 bg-surface-muted/50 px-4 py-3.5 text-left transition-colors active:bg-surface-muted/70 hover:bg-surface-muted/70 hover:border-accent/40 sm:min-h-0"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">This week&apos;s operating priorities</p>
            </div>
            <p className="mt-2.5 whitespace-pre-wrap text-[13px] leading-relaxed text-text-secondary">
              {plansForThisWeekShort}
            </p>
            <p className="mt-1.5 text-[11px] text-text-faint">
              Tap for full detail ↓
            </p>
          </button>
          <button
            type="button"
            onClick={() => onSectionChange?.("first90AndFieldKit")}
            className="flex min-h-[88px] touch-target flex-col justify-center rounded-xl border border-accent/25 bg-surface-muted/50 px-4 py-4 text-left transition-colors active:bg-surface-muted/70 hover:bg-surface-muted/70 hover:border-accent/40 sm:min-h-0 sm:py-3.5"
          >
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Last account update</p>
            </div>
            <p className="mt-2 text-[15px] font-bold text-text-primary">
              {lastUpdate?.title ?? "Daily account reset"}
            </p>
            <p className="mt-0.5 text-[13px] text-text-secondary">{lastUpdate?.createdAt ?? "Today"}</p>
          </button>
          <button
            type="button"
            onClick={() => onSectionChange?.("first90AndFieldKit")}
            className="flex min-h-[88px] touch-target flex-col justify-center rounded-xl border border-accent/25 bg-surface-muted/50 px-4 py-4 text-left transition-colors active:bg-surface-muted/70 hover:bg-surface-muted/70 hover:border-accent/40 sm:min-h-0 sm:py-3.5"
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Today&apos;s must-win move</p>
            </div>
            <p className="mt-2 text-[15px] font-bold text-text-primary">
              {topPriority?.title ?? "Define the first pilot"}
            </p>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              {topPriority?.owner ?? champion?.name} · {topPriority?.dueLabel ?? "This week"}
            </p>
          </button>
        </div>
      </section>

      {/* This week's operating priorities */}
      <section id="plans-for-this-week-detail" className="scroll-mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent/75" strokeWidth={2} />
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            This week&apos;s operating priorities
          </p>
        </div>
        <div className="rounded-2xl border border-accent/20 bg-surface-muted/50 p-4 sm:p-6">
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-text-secondary">
            {plansForThisWeek}
          </p>
          <p className="mt-3 text-[11px] text-text-faint">
            From last week&apos;s notes and where things need to progress.
          </p>
        </div>
      </section>

      {/* Competitive and AI market signals */}
      <section className="space-y-4">
        <SectionHeader
          title="Competitive and AI market signals"
          subtitle="Signals and competitive context that shape account strategy, urgency, and next actions."
        />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="rounded-[28px] border border-accent/20 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-text-secondary">
              <Crosshair className="h-4 w-4 text-accent/75" strokeWidth={1.8} />
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
                Competitive pressure point
              </p>
            </div>
            <p className="mt-4 text-[14px] font-medium text-text-primary">
              {topCompetitor?.name ?? "Incumbent platform pressure"}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
              {topCompetitor
                ? `${topCompetitor.strengthAreas.slice(0, 2).join(" · ")}`
                : "The deal is most at risk when incumbent platforms make the customer default to convenience over quality."}
            </p>
            <p className="mt-3 text-[12px] leading-relaxed text-text-muted">
              Win by forcing a narrow comparison around enterprise governance, measurable outcomes, and the exact workflow where the customer feels pain.
            </p>
          </div>
          <div className="space-y-4">
            {signals.slice(0, 3).map((signal) => (
              <div
                key={signal.id}
                className="rounded-[22px] border border-accent/20 bg-white/[0.02] px-4 py-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-text-faint">
                    {signal.priority}
                  </span>
                  <span className="text-[11px] text-text-faint">
                    {signal.sourceLabel} · {signal.sourceFreshness}
                  </span>
                </div>
                <p className="mt-3 text-[15px] font-medium text-text-primary">{signal.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                  {signal.summary}
                </p>
                <p className="mt-3 text-[12px] leading-relaxed text-accent/80">
                  {signal.recommendedAction}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform narrative (lower on page) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]">
        <section className="min-w-0 rounded-[28px] border border-accent/20 bg-white/[0.02] p-4 sm:p-6">
          <SectionHeader
            title="Platform narrative and account strategy"
            subtitle="How I would position Snowflake in this account after priorities, stakeholders, and operating plan are clear."
          />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Land motion</p>
              <p className="mt-3 text-[15px] font-medium text-text-primary">{account.firstWedge}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                Keep the first sale narrow, measurable, and sponsor-friendly. The first win should earn the right to expand.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Champion building</p>
              <p className="mt-3 text-[15px] font-medium text-text-primary">
                {champion?.title ?? "Likely functional champion"}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                {champion?.note ?? "Find the operator with urgency, cross-functional influence, and clear upside from a successful pilot."}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Pilot strategy</p>
              <p className="mt-3 text-[15px] font-medium text-text-primary">
                {firstDecision?.title ?? "Define the first pilot"}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                {firstDecision?.detail ?? "Define owners, timeline, success metrics, and required governance before broad executive escalation."}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Expansion path</p>
              <p className="mt-3 text-[15px] font-medium text-text-primary">
                {expansionItem?.title ?? account.topExpansionPaths[0]}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                Name the second motion early so leadership sees a durable platform decision, not a one-off experiment.
              </p>
            </div>
          </div>
        </section>
        <aside className="min-w-0 space-y-4">
          <div className="rounded-[28px] border border-accent/15 bg-accent/[0.05] p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <SnowflakeLogoIcon size={16} className="opacity-90" />
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent/80">
                Current account recommendation
              </p>
            </div>
            <p className="mt-4 text-[16px] leading-relaxed text-text-primary">
              {currentRecommendation}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
