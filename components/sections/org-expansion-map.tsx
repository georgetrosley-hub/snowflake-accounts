"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CircleAlert, Target, TrendingUp, Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { OrgNodeCard } from "@/components/ui/org-node-card";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { OpenAILogo } from "@/components/ui/openai-logo";
import type { OrgNode, Account, Competitor } from "@/types";

interface OrgExpansionMapProps {
  nodes: OrgNode[];
  account: Account;
  competitors: Competitor[];
}

const departmentOrder = [
  "Engineering",
  "Platform Engineering",
  "Security",
  "IT",
  "Finance",
  "Legal",
  "Operations",
  "Customer Support",
  "Product",
  "Data / AI",
  "Executive Leadership",
] as const;

const defaultUseCases: Record<(typeof departmentOrder)[number], string> = {
  Engineering: "Code generation and review",
  "Platform Engineering": "Internal tooling and docs",
  Security: "Policy and compliance review",
  IT: "Help desk and provisioning",
  Finance: "Excel and reporting automation",
  Legal: "Contract and document review",
  Operations: "Process documentation",
  "Customer Support": "Ticket handling and knowledge",
  Product: "PRD and spec generation",
  "Data / AI": "Model and data workflows",
  "Executive Leadership": "Strategic synthesis and reporting",
};

const activeStatuses = new Set<OrgNode["status"]>(["engaged", "pilot", "deployed"]);

const statusPriority: Record<OrgNode["status"], number> = {
  deployed: 0,
  pilot: 1,
  engaged: 2,
  identified: 3,
  latent: 4,
};

const laneConfig = [
  {
    id: "active",
    title: "Active motion",
    description: "Departments already in live conversations, pilots, or deployment.",
    emptyState: "No departments are in active motion yet.",
    className: "border-accent/12 bg-accent/[0.04]",
    items: (nodes: OrgNode[]) => nodes.filter((node) => activeStatuses.has(node.status)),
  },
  {
    id: "next",
    title: "Build next",
    description: "Qualified expansion candidates with strong fit but more mapping required.",
    emptyState: "No near-term candidates have been identified yet.",
    className: "border-sky-400/12 bg-sky-400/[0.04]",
    items: (nodes: OrgNode[]) => nodes.filter((node) => node.status === "identified"),
  },
  {
    id: "later",
    title: "Longer-term bets",
    description: "Strategic teams to sequence after the initial wedge is proving out.",
    emptyState: "No longer-term bets are currently queued.",
    className: "border-white/8 bg-white/[0.02]",
    items: (nodes: OrgNode[]) => nodes.filter((node) => node.status === "latent"),
  },
] as const;

export function OrgExpansionMap({ nodes, account, competitors }: OrgExpansionMapProps) {
  const normalizedNodes = useMemo<OrgNode[]>(
    () =>
      departmentOrder.map((name) => {
        const existing = nodes.find((node) => node.name === name);
        if (existing) return existing;
        return {
          id: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          name,
          useCase: defaultUseCases[name],
          buyingLikelihood: 50,
          arrPotential: 0,
          status: "latent",
          recommendedNextStep: "Map stakeholders",
        };
      }),
    [nodes]
  );

  const rankedNodes = useMemo(
    () =>
      [...normalizedNodes].sort((a, b) => {
        const statusDiff = statusPriority[a.status] - statusPriority[b.status];
        if (statusDiff !== 0) return statusDiff;
        if (b.arrPotential !== a.arrPotential) return b.arrPotential - a.arrPotential;
        if (b.buyingLikelihood !== a.buyingLikelihood) {
          return b.buyingLikelihood - a.buyingLikelihood;
        }
        return a.name.localeCompare(b.name);
      }),
    [normalizedNodes]
  );

  const activeNodes = rankedNodes.filter((node) => activeStatuses.has(node.status));
  const totalPotential = normalizedNodes.reduce((sum, node) => sum + node.arrPotential, 0);
  const averageLikelihood = Math.round(
    normalizedNodes.reduce((sum, node) => sum + node.buyingLikelihood, 0) / normalizedNodes.length
  );
  const focusNode = rankedNodes[0] ?? normalizedNodes[0];
  const laneGroups = laneConfig.map((lane) => ({
    ...lane,
    nodes: lane.items(rankedNodes),
  }));

  const expansionPitch = useStreaming();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const generateExpansionPitch = useCallback(
    (deptName: string) => {
      setSelectedDept(deptName);
      const node = normalizedNodes.find((n) => n.name === deptName);
      expansionPitch.startStream({
        url: "/api/generate",
        body: {
          type: "expansion_pitch",
          account,
          competitors,
          context: `Department: ${deptName}\nUse case: ${node?.useCase ?? "General"}\nCurrent status: ${node?.status ?? "latent"}\nBuying likelihood: ${node?.buyingLikelihood ?? 50}%\nARR potential: $${(node?.arrPotential ?? 0).toFixed(2)}M`,
        },
      });
    },
    [normalizedNodes, account, competitors, expansionPitch]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-8 sm:space-y-10"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeader
          title="Org expansion map"
          subtitle={`${activeNodes.length} departments in motion · $${totalPotential.toFixed(2)}M total expansion ARR potential`}
        />

        <div className="flex flex-wrap gap-2">
          {rankedNodes.slice(0, 3).map((node, index) => (
            <div
              key={node.id}
              className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] text-text-secondary"
            >
              <span className="text-text-faint">#{index + 1}</span> {node.name}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
            Departments in motion
          </p>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-text-primary">
            {activeNodes.length}
          </p>
          <p className="mt-1 text-[12px] text-text-muted">
            Pilot, deployed, or actively engaged teams.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
            Expansion ARR
          </p>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-text-primary">
            ${totalPotential.toFixed(2)}M
          </p>
          <p className="mt-1 text-[12px] text-text-muted">
            Full cross-functional upside across the account.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">
            Avg. buying likelihood
          </p>
          <p className="mt-3 text-[28px] font-semibold tracking-tight text-text-primary">
            {averageLikelihood}%
          </p>
          <p className="mt-1 text-[12px] text-text-muted">
            Average readiness across every mapped department.
          </p>
        </div>

        <div className="rounded-[24px] border border-accent/12 bg-accent/[0.04] p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-accent/65">
            Highest priority
          </p>
          <p className="mt-3 text-[18px] font-semibold tracking-tight text-text-primary">
            {focusNode?.name ?? "No focus area"}
          </p>
          <p className="mt-1 text-[12px] text-text-muted">
            {focusNode ? `${focusNode.buyingLikelihood}% likelihood · $${focusNode.arrPotential.toFixed(2)}M ARR` : "Prioritize the first internal wedge."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <div className="space-y-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
                Expansion lanes
              </p>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-text-muted">
                The org view is now organized by motion instead of forcing every team into a noisy
                diagram. This makes the sequence obvious: what is active now, what should be built
                next, and what can wait.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-[12px] text-accent/70">
              <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.8} />
              Expansion strategy, not org-chart spaghetti
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {laneGroups.map((lane, laneIndex) => (
              <motion.section
                key={lane.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: laneIndex * 0.06, duration: 0.4 }}
                className={`rounded-[24px] border p-4 sm:p-5 ${lane.className}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
                      {lane.title}
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-text-muted">
                      {lane.description}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                    {lane.nodes.length}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {lane.nodes.length > 0 ? (
                    lane.nodes.map((node) => (
                      <OrgNodeCard
                        key={node.id}
                        node={node}
                        onGeneratePitch={() => generateExpansionPitch(node.name)}
                      />
                    ))
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-white/8 bg-white/[0.02] px-4 py-5 text-[12px] leading-relaxed text-text-muted">
                      {lane.emptyState}
                    </div>
                  )}
                </div>
              </motion.section>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-accent/12 bg-gradient-to-br from-accent/[0.06] via-surface-elevated/70 to-surface/60 p-4 sm:rounded-[30px] sm:p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accent/[0.12]">
                <OpenAILogo size={14} className="text-accent" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent/65">
                  Expansion brief
                </p>
                <p className="text-[13px] font-medium text-text-primary">{account.name}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-medium text-text-primary">Current thesis</p>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                {account.firstWedge}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Users className="h-4 w-4 text-accent/75" strokeWidth={1.8} />
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-faint">
                    Executive sponsors
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  {account.executiveSponsors.slice(0, 3).map((sponsor) => (
                    <div
                      key={sponsor}
                      className="rounded-2xl border border-white/5 bg-black/10 px-3 py-2 text-[12px] text-text-secondary"
                    >
                      {sponsor}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-text-secondary">
                  <CircleAlert className="h-4 w-4 text-accent/75" strokeWidth={1.8} />
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-faint">
                    Key blockers
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  {account.topBlockers.slice(0, 3).map((blocker) => (
                    <div
                      key={blocker}
                      className="rounded-2xl border border-white/5 bg-black/10 px-3 py-2 text-[12px] leading-relaxed text-text-secondary"
                    >
                      {blocker}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent/75" strokeWidth={1.8} />
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
                Best expansion paths
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {account.topExpansionPaths.slice(0, 3).map((path, index) => (
                <div
                  key={path}
                  className="px-1 py-1"
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-text-faint">
                    <span>Path {index + 1}</span>
                    <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{path}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
              Top opportunities
            </p>
            <div className="mt-4 space-y-3">
              {rankedNodes.slice(0, 3).map((node, index) => (
                <div
                  key={node.id}
                  className="flex flex-col gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[11px] font-semibold text-text-secondary">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-text-primary">{node.name}</p>
                    <p className="mt-0.5 text-[11px] text-text-muted">
                      {node.buyingLikelihood}% likelihood · ${node.arrPotential.toFixed(2)}M ARR
                    </p>
                  </div>
                  <button
                    onClick={() => generateExpansionPitch(node.name)}
                    className="self-start rounded-full border border-accent/15 bg-accent/[0.08] p-2 text-accent/80 transition-colors hover:bg-accent/[0.14] sm:self-auto"
                    title={`Generate expansion pitch for ${node.name}`}
                  >
                    <OpenAILogo size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expansion pitch */}
      {(expansionPitch.content || expansionPitch.isStreaming) && (
        <StreamingContent
          content={expansionPitch.content}
          isStreaming={expansionPitch.isStreaming}
          onRegenerate={() => selectedDept && generateExpansionPitch(selectedDept)}
          label={`Expansion: ${selectedDept}`}
        />
      )}
    </motion.div>
  );
}
