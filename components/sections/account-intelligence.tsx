"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Users,
  Swords,
  Compass,
  Sparkles,
  ChevronRight,
  Building2,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import type { Account, Competitor, Stakeholder } from "@/types";

interface AccountIntelligenceProps {
  account: Account;
  competitors: Competitor[];
  stakeholders: Stakeholder[];
  onNavigateTo?: (section: string) => void;
}

export function AccountIntelligence({
  account,
  competitors,
  stakeholders,
  onNavigateTo,
}: AccountIntelligenceProps) {
  const champion = stakeholders.find((s) => s.stance === "champion" || s.stance === "ally");
  const executive = stakeholders.find((s) => s.stance === "executive");
  const blocker = stakeholders.find((s) => s.stance === "blocker");
  const topCompetitors = [...competitors]
    .sort((a, b) => b.accountRiskLevel - a.accountRiskLevel)
    .slice(0, 3);

  const aiInitiatives = [
    { label: "AI maturity", value: `${account.aiMaturityScore}/100`, desc: account.aiMaturityScore >= 75 ? "High adoption readiness" : account.aiMaturityScore >= 50 ? "Moderate adoption" : "Early stage" },
    { label: "First wedge", value: account.firstWedge, desc: "Best entry point" },
    { label: "Developer population", value: account.developerPopulation.toLocaleString(), desc: "Internal tech capacity" },
    { label: "Security posture", value: account.securitySensitivity >= 90 ? "High" : account.securitySensitivity >= 75 ? "Medium" : "Standard", desc: "Governance requirements" },
  ];

  const politicalMap = [
    champion && { role: "Champion", name: champion.name, title: champion.title, color: "emerald" },
    executive && { role: "Economic buyer", name: executive.name, title: executive.title, color: "accent" },
    blocker && { role: "Blocker", name: blocker.name, title: blocker.title, color: "rose" },
  ].filter(Boolean) as { role: string; name: string; title: string; color: string }[];

  const entryPoints = [
    { title: "Best first wedge", desc: account.firstWedge },
    { title: "Top blocker", desc: account.topBlockers[0] ?? "None identified" },
    { title: "Expansion path", desc: account.topExpansionPaths[0] ?? account.firstWedge },
  ];

  const useCases = account.topExpansionPaths.slice(0, 4).map((path, i) => ({
    id: `uc-${i}`,
    title: path,
    fit: "High" as const,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-8 sm:space-y-10"
    >
      <SectionHeader
        title="Account intelligence"
        subtitle={`Everything you need on ${account.name}: AI initiatives, leadership, competitive landscape, entry points, and Claude use cases.`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI initiatives */}
        <section className="rounded-2xl border border-surface-border/40 bg-surface-elevated/30 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Zap className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
            </div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-text-primary">
              AI initiatives
            </h3>
          </div>
          <div className="space-y-4">
            {aiInitiatives.map((item, i) => (
              <div key={i} className="flex justify-between gap-4 border-b border-surface-border/30 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-text-faint">{item.label}</p>
                  <p className="mt-1 text-[13px] text-text-secondary">{item.desc}</p>
                </div>
                <p className="text-[13px] font-medium text-text-primary text-right shrink-0 max-w-[50%]">
                  {typeof item.value === "string" && item.value.length > 60
                    ? `${item.value.slice(0, 60)}…`
                    : item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership map */}
        <section className="rounded-2xl border border-surface-border/40 bg-surface-elevated/30 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
              <Users className="h-4 w-4 text-sky-400" strokeWidth={1.8} />
            </div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-text-primary">
              Leadership map
            </h3>
          </div>
          <div className="space-y-3">
            {account.executiveSponsors.slice(0, 4).map((sponsor, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-surface-border/30 px-3 py-2">
                <div>
                  <p className="text-[13px] font-medium text-text-primary">
                    {sponsor.replace(/\s*\([^)]*\)\s*$/, "")}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {sponsor.match(/\(([^)]+)\)/)?.[1] ?? "Executive"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Political map */}
        <section className="rounded-2xl border border-surface-border/40 bg-surface-elevated/30 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Building2 className="h-4 w-4 text-accent" strokeWidth={1.8} />
            </div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-text-primary">
              Political map
            </h3>
          </div>
          <div className="space-y-3">
            {politicalMap.map((p, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  p.color === "emerald" && "border-emerald-400/25 bg-emerald-400/[0.05]",
                  p.color === "accent" && "border-accent/25 bg-accent/[0.05]",
                  p.color === "rose" && "border-rose-400/25 bg-rose-400/[0.05]"
                )}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">{p.role}</p>
                <p className="mt-1 text-[13px] font-medium text-text-primary">{p.name} · {p.title}</p>
              </div>
            ))}
          </div>
          {onNavigateTo && (
            <button
              type="button"
              onClick={() => onNavigateTo("stakeholders")}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-surface-border/40 py-2 text-[12px] text-text-muted transition-colors hover:border-accent/30 hover:bg-accent/[0.04] hover:text-accent/90"
            >
              Full stakeholder map
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </section>

        {/* Competitive tools */}
        <section className="rounded-2xl border border-surface-border/40 bg-surface-elevated/30 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Swords className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
            </div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-text-primary">
              Competitive tools
            </h3>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-faint">Existing footprint</p>
            <div className="flex flex-wrap gap-2">
              {account.existingVendorFootprint.map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-surface-border/50 bg-surface-muted/40 px-2.5 py-1 text-[11px] text-text-secondary"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-faint">Competitive risk</p>
            <div className="space-y-2">
              {topCompetitors.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-surface-border/30 px-3 py-2"
                >
                  <span className="text-[13px] font-medium text-text-primary">{c.name}</span>
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      c.accountRiskLevel >= 80 ? "text-rose-400" : c.accountRiskLevel >= 60 ? "text-amber-400" : "text-text-muted"
                    )}
                  >
                    {c.accountRiskLevel}% risk
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Entry points */}
      <section className="rounded-2xl border border-accent/20 bg-accent/[0.03] p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <Compass className="h-4 w-4 text-accent" strokeWidth={1.8} />
          </div>
          <h3 className="text-[13px] font-semibold uppercase tracking-wider text-text-primary">
            Entry points
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {entryPoints.map((ep, i) => (
            <div
              key={i}
              className="rounded-xl border border-surface-border/40 bg-surface-elevated/30 px-4 py-3"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">{ep.title}</p>
              <p className="mt-2 text-[13px] text-text-secondary">{ep.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Claude use cases */}
      <section className="rounded-2xl border border-surface-border/40 bg-surface-elevated/30 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Sparkles className="h-4 w-4 text-violet-400" strokeWidth={1.8} />
            </div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-text-primary">
              Claude use cases
            </h3>
          </div>
          {onNavigateTo && (
            <button
              type="button"
              onClick={() => onNavigateTo("useCaseLibrary")}
              className="text-[12px] font-medium text-accent/90 hover:text-accent transition-colors"
            >
              View full library →
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {useCases.map((uc) => (
            <div
              key={uc.id}
              className="flex items-center justify-between rounded-xl border border-surface-border/40 px-4 py-3 transition-colors hover:border-accent/25"
            >
              <p className="text-[13px] text-text-primary">{uc.title}</p>
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                {uc.fit} fit
              </span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
