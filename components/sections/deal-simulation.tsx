"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Users,
  Map,
  Compass,
  Rocket,
  TrendingUp,
  ChevronRight,
  Target,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import type { Account, Competitor, Stakeholder } from "@/types";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "orgMap", label: "Org Map", icon: Network },
  { id: "buyingCommittee", label: "Buying Committee", icon: Users },
  { id: "politicalMap", label: "Political Map", icon: Map },
  { id: "entryStrategy", label: "Entry Strategy", icon: Compass },
  { id: "expansionPlan", label: "Expansion Plan", icon: Rocket },
  { id: "timeline", label: "Timeline to $10M ARR", icon: TrendingUp },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface DealSimulationProps {
  account: Account;
  stakeholders: Stakeholder[];
  competitors: Competitor[];
}

export function DealSimulation({
  account,
  stakeholders,
  competitors,
}: DealSimulationProps) {
  const [activeTab, setActiveTab] = useState<TabId>("orgMap");
  const champion = stakeholders.find((s) => s.stance === "champion") ?? stakeholders[0];
  const sponsor = stakeholders.find((s) => s.stance === "executive") ?? stakeholders[1] ?? stakeholders[0];
  const security = stakeholders.find((s) => s.team === "Security");
  const procurement = stakeholders.find((s) => s.team === "Procurement");

  const expansionPath = account.topExpansionPaths ?? [];
  const landValue = account.estimatedLandValue;
  const expansionValue = account.estimatedExpansionValue;

  const content: Record<TabId, React.ReactNode> = {
    orgMap: (
      <div className="space-y-6">
        <p className="text-[14px] leading-relaxed text-text-muted">
          The org structure I&apos;d map for the first wedge at {account.name}:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {stakeholders.map((s) => (
            <div
              key={s.id}
              className={cn(
                "rounded-xl border px-4 py-3",
                s.stance === "champion"
                  ? "border-emerald-400/30 bg-emerald-400/[0.06]"
                  : s.stance === "blocker"
                    ? "border-rose-400/20 bg-rose-400/[0.04]"
                    : "border-surface-border/40 bg-surface-elevated/40"
              )}
            >
              <p className="text-[13px] font-medium text-text-primary">
                {s.name} · {s.title}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">{s.team}</p>
              <p className="mt-2 text-[12px] text-text-secondary">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    buyingCommittee: (
      <div className="space-y-6">
        <p className="text-[14px] leading-relaxed text-text-muted">
          Functional buyer, executive sponsor, security gatekeeper, procurement.
        </p>
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/[0.05] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-400/90">
              Functional buyer
            </p>
            <p className="mt-1 text-[14px] font-medium text-text-primary">
              {champion?.name ?? "—"} · {champion?.title ?? "—"}
            </p>
            <p className="mt-2 text-[12px] text-text-secondary">
              {champion?.proofNeeded ?? "Pilot scope with clear success criteria."}
            </p>
          </div>
          <div className="rounded-xl border border-accent/25 bg-accent/[0.05] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-accent/90">
              Executive sponsor
            </p>
            <p className="mt-1 text-[14px] font-medium text-text-primary">
              {sponsor?.name ?? "—"} · {sponsor?.title ?? "—"}
            </p>
            <p className="mt-2 text-[12px] text-text-secondary">
              {sponsor?.proofNeeded ?? "Business value narrative, not product capability."}
            </p>
          </div>
          <div className="rounded-xl border border-surface-border/40 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
              Technical / security gate
            </p>
            <p className="mt-1 text-[14px] font-medium text-text-primary">
              {security ? `${security.name} · ${security.title}` : "Security reviewer · To be mapped"}
            </p>
            <p className="mt-2 text-[12px] text-text-secondary">
              {security?.proofNeeded ?? "Data flow, identity, retention, bounded pilot scope."}
            </p>
          </div>
          <div className="rounded-xl border border-surface-border/40 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
              Commercial
            </p>
            <p className="mt-1 text-[14px] font-medium text-text-primary">
              {procurement ? `${procurement.name} · ${procurement.title}` : "Procurement lead · To be mapped"}
            </p>
            <p className="mt-2 text-[12px] text-text-secondary">
              {procurement?.proofNeeded ?? "Timing, spend, pilot-to-production path."}
            </p>
          </div>
        </div>
      </div>
    ),
    politicalMap: (
      <div className="space-y-6">
        <p className="text-[14px] leading-relaxed text-text-muted">
          Champions, allies, neutrals, blockers. How I&apos;d navigate the internal politics.
        </p>
        <div className="space-y-3">
          {stakeholders.map((s) => (
            <div
              key={s.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3",
                s.stance === "champion" && "border-emerald-400/30 bg-emerald-400/[0.06]",
                s.stance === "ally" && "border-sky-400/20 bg-sky-400/[0.04]",
                s.stance === "blocker" && "border-rose-400/25 bg-rose-400/[0.06]",
                s.stance === "neutral" && "border-surface-border/40 bg-surface-elevated/30",
                s.stance === "executive" && "border-accent/25 bg-accent/[0.05]"
              )}
            >
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
                  s.stance === "champion" && "bg-emerald-400/20 text-emerald-400",
                  s.stance === "ally" && "bg-sky-400/20 text-sky-400",
                  s.stance === "blocker" && "bg-rose-400/20 text-rose-400",
                  s.stance === "neutral" && "bg-white/10 text-text-muted",
                  s.stance === "executive" && "bg-accent/20 text-accent"
                )}
              >
                {s.stance}
              </span>
              <div>
                <p className="text-[13px] font-medium text-text-primary">
                  {s.name} · {s.title}
                </p>
                <p className="mt-0.5 text-[12px] text-text-secondary">{s.nextStep}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    entryStrategy: (
      <div className="space-y-6">
        <p className="text-[14px] leading-relaxed text-text-muted">
          First contact, champion creation, pilot design, security path.
        </p>
        <ol className="space-y-4">
          {[
            {
              title: "First contact",
              body: `Land via ${account.firstWedge}. Target ${champion?.title ?? "functional buyer"} for the first wedge.`,
            },
            {
              title: "Champion creation",
              body: champion?.note ?? `Turn the wedge into a measurable pilot with named success criteria. Get ${champion?.name ?? "the champion"} to co-author the 30-day scope.`,
            },
            {
              title: "Pilot design",
              body: account.firstWedge,
            },
            {
              title: "Security / legal path",
              body: account.topBlockers[0] ?? "Clean deployment narrative, data flow, identity controls before the review meeting.",
            },
          ].map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-xl border border-surface-border/40 px-4 py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[12px] font-semibold text-accent">
                {i + 1}
              </span>
              <div>
                <p className="text-[13px] font-medium text-text-primary">{step.title}</p>
                <p className="mt-1 text-[12px] text-text-secondary">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    ),
    expansionPlan: (
      <div className="space-y-6">
        <p className="text-[14px] leading-relaxed text-text-muted">
          How the deal grows from first wedge to enterprise platform.
        </p>
        <div className="space-y-4">
          <div className="rounded-xl border border-accent/25 bg-accent/[0.05] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-accent/90">
              Initial entry
            </p>
            <p className="mt-1 text-[14px] font-medium text-text-primary">{account.firstWedge}</p>
            <p className="mt-1 text-[12px] text-text-secondary">
              ~${landValue.toFixed(1)}M pilot
            </p>
          </div>
          {expansionPath.slice(0, 4).map((path, i) => (
            <div
              key={path}
              className="flex items-center gap-3 rounded-xl border border-surface-border/40 px-4 py-3"
            >
              <ChevronRight className="h-4 w-4 shrink-0 text-text-faint" />
              <p className="text-[13px] text-text-secondary">{path}</p>
            </div>
          ))}
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/[0.05] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-400/90">
              Revenue expansion path
            </p>
            <p className="mt-2 text-[13px] text-text-primary">
              ${landValue.toFixed(1)}M pilot → ${(landValue * 2).toFixed(1)}M BU deployment → ${expansionValue.toFixed(1)}M+ enterprise rollout
            </p>
          </div>
        </div>
      </div>
    ),
    timeline: (
      <div className="space-y-6">
        <p className="text-[14px] leading-relaxed text-text-muted">
          Rough timeline from first contact to $10M ARR potential.
        </p>
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-border/40 px-4 py-3">
            <p className="text-[13px] font-medium text-text-primary">First contact & discovery</p>
            <p className="mt-0.5 text-[11px] text-text-muted">Weeks 1–2</p>
          </div>
          <div className="rounded-xl border border-surface-border/40 px-4 py-3">
            <p className="text-[13px] font-medium text-text-primary">Champion identified, pilot scope</p>
            <p className="mt-0.5 text-[11px] text-text-muted">Weeks 3–6</p>
          </div>
          <div className="rounded-xl border border-accent/25 px-4 py-3 bg-accent/[0.05]">
            <p className="text-[13px] font-medium text-text-primary">Security & legal review</p>
            <p className="mt-0.5 text-[11px] text-text-muted">Weeks 7–10</p>
          </div>
          <div className="rounded-xl border border-surface-border/40 px-4 py-3">
            <p className="text-[13px] font-medium text-text-primary">Pilot kickoff & expansion</p>
            <p className="mt-0.5 text-[11px] text-text-muted">Months 4–12</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3">
            <Target className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
            <p className="text-[13px] font-medium text-text-primary">
              $10M ARR path: Land → 2–3 BU deployments → enterprise platform
            </p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-8 sm:space-y-10"
    >
      <SectionHeader
        title="How I'd run this deal"
        subtitle={`Account: ${account.name} — My playbook for this deal end-to-end.`}
      />

      <div className="flex flex-wrap gap-1 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-accent/15 text-accent"
                  : "text-text-muted hover:bg-surface-muted/50 hover:text-text-secondary"
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {content[activeTab]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
